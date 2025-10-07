from django.db import migrations
import uuid

class Migration(migrations.Migration):
    dependencies = [
        ('voting', '0002_add_voter_approval'),
    ]

    operations = [
        # Add a new UUID column to voting_candidate
        migrations.RunSQL(
            sql="ALTER TABLE voting_candidate ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();",
            reverse_sql="ALTER TABLE voting_candidate DROP COLUMN uuid_id;",
        ),
        # Populate the new UUID column in voting_candidate
        migrations.RunSQL(
            sql="UPDATE voting_candidate SET uuid_id = uuid_generate_v4() WHERE uuid_id IS NULL;",
            reverse_sql="",
        ),
        # Drop the foreign key constraint on voting_vote
        migrations.RunSQL(
            sql="ALTER TABLE voting_vote DROP CONSTRAINT voting_vote_candidate_id_95b5ad18_fk_voting_candidate_id;",
            reverse_sql="ALTER TABLE voting_vote ADD CONSTRAINT voting_vote_candidate_id_95b5ad18_fk_voting_candidate_id FOREIGN KEY (candidate_id) REFERENCES voting_candidate (id) DEFERRABLE INITIALLY DEFERRED;",
        ),
        # Drop the old id constraint on voting_candidate
        migrations.RunSQL(
            sql="ALTER TABLE voting_candidate DROP CONSTRAINT voting_candidate_pkey;",
            reverse_sql="ALTER TABLE voting_candidate ADD CONSTRAINT voting_candidate_pkey PRIMARY KEY (id);",
        ),
        # Drop the old id column on voting_candidate
        migrations.RunSQL(
            sql="ALTER TABLE voting_candidate DROP COLUMN id;",
            reverse_sql="ALTER TABLE voting_candidate ADD COLUMN id BIGSERIAL PRIMARY KEY;",
        ),
        # Set the new uuid_id as the primary key on voting_candidate
        migrations.RunSQL(
            sql="ALTER TABLE voting_candidate ADD CONSTRAINT voting_candidate_pkey PRIMARY KEY (uuid_id);",
            reverse_sql="ALTER TABLE voting_candidate DROP CONSTRAINT voting_candidate_pkey;",
        ),
        # Rename the new UUID column to id on voting_candidate
        migrations.RunSQL(
            sql="ALTER TABLE voting_candidate RENAME COLUMN uuid_id TO id;",
            reverse_sql="ALTER TABLE voting_candidate RENAME COLUMN id TO uuid_id;",
        ),
        # Add a new UUID column to voting_vote for candidate_id
        migrations.RunSQL(
            sql="ALTER TABLE voting_vote ADD COLUMN uuid_candidate_id uuid;",
            reverse_sql="ALTER TABLE voting_vote DROP COLUMN uuid_candidate_id;",
        ),
        # Populate the new uuid_candidate_id with generated UUIDs (you may need to map existing bigint IDs)
        migrations.RunSQL(
            sql="""
            UPDATE voting_vote v
            SET uuid_candidate_id = (
                SELECT uuid_generate_v4()
                FROM voting_candidate c
                WHERE c.id::text::uuid = v.candidate_id::text::uuid
                LIMIT 1
            )
            WHERE uuid_candidate_id IS NULL;
            """,
            reverse_sql="",
        ),
        # Drop the old candidate_id column
        migrations.RunSQL(
            sql="ALTER TABLE voting_vote DROP COLUMN candidate_id;",
            reverse_sql="ALTER TABLE voting_vote ADD COLUMN candidate_id BIGINT;",
        ),
        # Rename the new UUID column to candidate_id
        migrations.RunSQL(
            sql="ALTER TABLE voting_vote RENAME COLUMN uuid_candidate_id TO candidate_id;",
            reverse_sql="ALTER TABLE voting_vote RENAME COLUMN candidate_id TO uuid_candidate_id;",
        ),
        # Recreate the foreign key constraint with the new UUID type
        migrations.RunSQL(
            sql="ALTER TABLE voting_vote ADD CONSTRAINT voting_vote_candidate_id_95b5ad18_fk_voting_candidate_id FOREIGN KEY (candidate_id) REFERENCES voting_candidate (id);",
            reverse_sql="ALTER TABLE voting_vote DROP CONSTRAINT voting_vote_candidate_id_95b5ad18_fk_voting_candidate_id;",
        ),
    ]