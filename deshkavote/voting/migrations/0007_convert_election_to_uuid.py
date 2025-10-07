from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('voting', '0004_fix_candidate_id'),
        ('voting', '0004_election_consensus_threshold'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                -- Enable UUID extension
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                
                -- Add temporary UUID column for election
                ALTER TABLE voting_election ADD COLUMN new_id uuid DEFAULT uuid_generate_v4();
                
                -- Make sure all elections have UUIDs
                UPDATE voting_election SET new_id = uuid_generate_v4() WHERE new_id IS NULL;
                
                -- Add new foreign key columns in related tables
                ALTER TABLE voting_candidate ADD COLUMN new_election_id uuid;
                ALTER TABLE voting_vote ADD COLUMN new_election_id uuid;
                
                -- Populate new foreign key columns
                UPDATE voting_candidate SET new_election_id = (
                    SELECT new_id FROM voting_election WHERE voting_election.id = voting_candidate.election_id
                );
                UPDATE voting_vote SET new_election_id = (
                    SELECT new_id FROM voting_election WHERE voting_election.id = voting_vote.election_id
                );
                
                -- Handle audit log if it exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_auditlog') THEN
                        IF EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='voting_auditlog' AND column_name='election_id') THEN
                            ALTER TABLE voting_auditlog ADD COLUMN new_election_id uuid;
                            UPDATE voting_auditlog SET new_election_id = (
                                SELECT new_id FROM voting_election WHERE voting_election.id = voting_auditlog.election_id
                            );
                        END IF;
                    END IF;
                END $$;
                
                -- Handle election node if it exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_electionnode') THEN
                        ALTER TABLE voting_electionnode ADD COLUMN new_election_id uuid;
                        UPDATE voting_electionnode SET new_election_id = (
                            SELECT new_id FROM voting_election WHERE voting_election.id = voting_electionnode.election_id
                        );
                    END IF;
                END $$;
                
                -- Drop ALL foreign key constraints that reference election.id
                ALTER TABLE voting_candidate DROP CONSTRAINT IF EXISTS voting_candidate_election_id_1286d9a6_fk_voting_election_id;
                ALTER TABLE voting_candidate DROP CONSTRAINT IF EXISTS voting_candidate_election_id_fkey;
                ALTER TABLE voting_candidate DROP CONSTRAINT IF EXISTS voting_candidate_election_id_fk;
                
                ALTER TABLE voting_vote DROP CONSTRAINT IF EXISTS voting_vote_election_id_56097513_fk_voting_election_id;
                ALTER TABLE voting_vote DROP CONSTRAINT IF EXISTS voting_vote_election_id_fkey;
                ALTER TABLE voting_vote DROP CONSTRAINT IF EXISTS voting_vote_election_id_fk;
                
                -- Drop audit log constraint if exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_auditlog') THEN
                        ALTER TABLE voting_auditlog DROP CONSTRAINT IF EXISTS voting_auditlog_election_id_fkey;
                        ALTER TABLE voting_auditlog DROP CONSTRAINT IF EXISTS voting_auditlog_election_id_fk;
                    END IF;
                END $$;
                
                -- Drop election node constraint if exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_electionnode') THEN
                        ALTER TABLE voting_electionnode DROP CONSTRAINT IF EXISTS voting_electionnode_election_id_fkey;
                        ALTER TABLE voting_electionnode DROP CONSTRAINT IF EXISTS voting_electionnode_election_id_fk;
                    END IF;
                END $$;
                
                -- NOW drop the primary key constraint
                ALTER TABLE voting_election DROP CONSTRAINT voting_election_pkey;
                
                -- Drop old id column and rename new one
                ALTER TABLE voting_election DROP COLUMN id;
                ALTER TABLE voting_election RENAME COLUMN new_id TO id;
                ALTER TABLE voting_election ADD PRIMARY KEY (id);
                
                -- Update all related tables - drop old columns and rename new ones
                ALTER TABLE voting_candidate DROP COLUMN election_id;
                ALTER TABLE voting_candidate RENAME COLUMN new_election_id TO election_id;
                ALTER TABLE voting_candidate ALTER COLUMN election_id SET NOT NULL;
                ALTER TABLE voting_candidate ADD CONSTRAINT voting_candidate_election_id_fk 
                    FOREIGN KEY (election_id) REFERENCES voting_election(id) ON DELETE CASCADE;
                
                ALTER TABLE voting_vote DROP COLUMN election_id;
                ALTER TABLE voting_vote RENAME COLUMN new_election_id TO election_id;
                ALTER TABLE voting_vote ALTER COLUMN election_id SET NOT NULL;
                ALTER TABLE voting_vote ADD CONSTRAINT voting_vote_election_id_fk 
                    FOREIGN KEY (election_id) REFERENCES voting_election(id) ON DELETE CASCADE;
                
                -- Update audit log if exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_auditlog') THEN
                        IF EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='voting_auditlog' AND column_name='new_election_id') THEN
                            ALTER TABLE voting_auditlog DROP COLUMN IF EXISTS election_id;
                            ALTER TABLE voting_auditlog RENAME COLUMN new_election_id TO election_id;
                            ALTER TABLE voting_auditlog ADD CONSTRAINT voting_auditlog_election_id_fk 
                                FOREIGN KEY (election_id) REFERENCES voting_election(id) ON DELETE SET NULL;
                        END IF;
                    END IF;
                END $$;
                
                -- Update election node if exists
                DO $$ 
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='voting_electionnode') THEN
                        IF EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name='voting_electionnode' AND column_name='new_election_id') THEN
                            ALTER TABLE voting_electionnode DROP COLUMN IF EXISTS election_id;
                            ALTER TABLE voting_electionnode RENAME COLUMN new_election_id TO election_id;
                            ALTER TABLE voting_electionnode ALTER COLUMN election_id SET NOT NULL;
                            ALTER TABLE voting_electionnode ADD CONSTRAINT voting_electionnode_election_id_fk 
                                FOREIGN KEY (election_id) REFERENCES voting_election(id) ON DELETE CASCADE;
                        END IF;
                    END IF;
                END $$;
            """,
            reverse_sql="SELECT 1;"  # Not reversible
        ),
    ]