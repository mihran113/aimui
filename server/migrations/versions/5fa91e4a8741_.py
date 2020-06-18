"""empty message

Revision ID: 5fa91e4a8741
Revises: 4f594a13ffea
Create Date: 2020-06-10 11:48:42.920341

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5fa91e4a8741'
down_revision = '4f594a13ffea'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('processes',
    sa.Column('uuid', sa.Text(), nullable=False),
    sa.Column('pid', sa.Text(), nullable=True),
    sa.Column('script_path', sa.Text(), nullable=True),
    sa.Column('arguments', sa.Text(), nullable=True),
    sa.Column('env_vars', sa.Text(), nullable=True),
    sa.Column('interpreter_path', sa.Text(), nullable=True),
    sa.Column('working_dir', sa.Text(), nullable=True),
    sa.Column('aim_experiment', sa.Text(), nullable=True),
    sa.Column('executable_id', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('is_archived', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('uuid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('processes')
    # ### end Alembic commands ###
