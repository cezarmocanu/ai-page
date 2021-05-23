from models import Option
from . import ma
    
class OptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Option
