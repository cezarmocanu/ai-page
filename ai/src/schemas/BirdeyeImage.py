from models import BirdeyeImage
from . import ma
    
class BirdeyeImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BirdeyeImage
