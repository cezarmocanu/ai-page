from models import ExtractedPage
from . import ma
    
class ExtractedPageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ExtractedPage
