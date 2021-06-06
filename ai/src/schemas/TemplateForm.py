from models import TemplateForm
from . import ma
    
class TemplateFormSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TemplateForm
