from . import db

class OCRAnalysis(db.Model):
    __tablename__ = 'ocr_analysis'
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(128), nullable=False)
    form = db.relationship('Form', uselist=False, backref='ocr_analysis')