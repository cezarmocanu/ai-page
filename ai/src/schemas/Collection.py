from models import Collection
from . import ma
    
class CollectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Collection
