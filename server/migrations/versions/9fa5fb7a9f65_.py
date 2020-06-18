"""empty message

Revision ID: 9fa5fb7a9f65
Revises: 317bc6adced3
Create Date: 2020-05-24 13:43:30.596164

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9fa5fb7a9f65'
down_revision = '317bc6adced3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('commit_tag',
    sa.Column('uuid', sa.Text(), nullable=False),
    sa.Column('commit_id', sa.Text(), nullable=True),
    sa.Column('tag_id', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['commit_id'], ['commits.uuid'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.uuid'], ),
    sa.PrimaryKeyConstraint('uuid')
    )
    op.drop_table('CommitTag')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('CommitTag',
    sa.Column('uuid', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('commit_id', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('tag_id', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['commit_id'], ['commits.uuid'], name='CommitTag_commit_id_fkey'),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.uuid'], name='CommitTag_tag_id_fkey'),
    sa.PrimaryKeyConstraint('uuid', name='CommitTag_pkey')
    )
    op.drop_table('commit_tag')
    # ### end Alembic commands ###
