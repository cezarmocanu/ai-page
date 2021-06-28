from models import Extraction
from . import ma
    
class ExtractionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Extraction
