from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'ed3369949311'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Enum 타입을 수정합니다.
    op.alter_column('investment_preferences', 'investment_goal',
                    existing_type=mysql.ENUM('원금보존 가능성을 포기하기 어렵기 때문에 예적금 수익률 보다 1~2%정도만 더 나오면 됨', 
                                             '예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음', 
                                             '고수익을 기대하고 있으며, 원금손실 가능성은 감수할 수 있음'),
                    type_=mysql.ENUM('원금보존 가능성을 포기하기 어렵기 때문에 예적금 수익률 보다 1~2%정도만 더 나오면 됨', 
                                     '예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음', 
                                     '고수익을 기대하고 있으며, 원금손실 가능성은 감수할 수 있음'),
                    existing_nullable=False)

    op.add_column('users', sa.Column('birthdate', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('phone_number', sa.String(length=100), nullable=True))

def downgrade():
    # 변경 사항을 되돌립니다.
    op.drop_column('users', 'birthdate')
    op.drop_column('users', 'phone_number')

    op.alter_column('investment_preferences', 'investment_goal',
                    existing_type=mysql.ENUM('원금보존 가능성을 포기하기 어렵기 때문에 예적금 수익률 보다 1~2%정도만 더 나오면 됨', 
                                             '예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음', 
                                             '고수익을 기대하고 있으며, 원금손실 가능성은 감수할 수 있음'),
                    type_=mysql.ENUM('LOW', 'MEDIUM', 'HIGH'),
                    existing_nullable=False)
