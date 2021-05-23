from models import OCRAnalysis
from . import ma
    
class OCRAnalysisSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OCRAnalysis
