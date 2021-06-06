from models import TemplateImage
from . import ma
    
class TemplateImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TemplateImage
