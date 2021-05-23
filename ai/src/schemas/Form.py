from models import Form
from . import ma
    
class FormSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form
