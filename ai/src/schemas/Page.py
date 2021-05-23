from models import Page
from . import ma
    
class PageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Page
