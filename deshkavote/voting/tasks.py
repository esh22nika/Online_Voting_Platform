# voting/tasks.py
from celery import shared_task
from django.core.cache import cache
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging
import time

logger = logging.getLogger(__name__)

@shared_task
def process_vote_consensus(vote_id):
    """Background task to process vote consensus"""
    try:
        from .models import Vote, VoteConsensusLog, ElectionNode
        
        vote = Vote.objects.get(id=vote_id)
        time.sleep(2)  # Simulate processing time

        # Get active nodes for this election
        nodes = ElectionNode.objects.filter(
            election=vote.election,
            status='active'
        )[:vote.required_confirmations]

        # Create consensus logs
        for node in nodes:
            VoteConsensusLog.objects.create(
                vote=vote,
                node_id=node.node_id,
                consensus_round=1,
                status='pending',
                signature=f"sig_{vote.vote_hash}_{node.node_id}"
            )

        node_count = nodes.count()

        # Simulate consensus achievement
        if node_count >= vote.required_confirmations:
            # Update consensus logs to confirmed
            VoteConsensusLog.objects.filter(vote=vote).update(status='confirmed')
            
            # Update vote status
            vote.status = 'finalized'
            vote.confirmation_count = node_count
            vote.save()
            
            cache.delete(f"vote_status_{vote_id}")
            
            # Notify via WebSocket
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"vote_{vote_id}",
                {
                    "type": "send_vote_update",
                    "data": {"status": "finalized", "message": "Your vote has been verified."}
                }
            )

        return f"Consensus achieved for vote {vote_id}"

    except Exception as e:
        logger.error(f"Error in vote consensus processing: {e}")
        return f"Error processing vote consensus: {e}"


@shared_task
def sync_election_across_nodes(election_id):
    """Background task to synchronize election across distributed nodes"""
    try:
        from .models import Election
        from django.core.cache import cache
        from django.utils import timezone
        
        election = Election.objects.get(id=election_id)

        # Sync time across nodes
        current_time = timezone.now()
        cache_key = f"election_sync_{election_id}"
        sync_data = {
            'start_time': election.start_date.isoformat(),
            'end_time': election.end_date.isoformat(),
            'sync_timestamp': current_time.isoformat(),
            'ntp_server': election.ntp_server
        }
        cache.set(cache_key, sync_data, timeout=3600)

        election.synchronized_start_time = election.start_date
        election.synchronized_end_time = election.end_date
        election.save()

        # Replicate election data to backup nodes
        for backup_server in election.backup_servers:
            cache.set(f"election_backup_{backup_server}_{election_id}",
                      election.name, timeout=86400)

        # Notify admins via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "admin_dashboard",
            {
                "type": "send_admin_update",
                "data": {"type": "election_update", "message": f"Election {election_id} synchronized."}
            }
        )

        return f"Election {election_id} synchronized across nodes"

    except Exception as e:
        logger.error(f"Error synchronizing election: {e}")
        return f"Error: {e}"