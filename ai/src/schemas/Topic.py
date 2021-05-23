from models import Topic
from . import ma
    
class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
