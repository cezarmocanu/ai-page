from models import CollectedImage
from . import ma
    
class CollectedImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CollectedImage
