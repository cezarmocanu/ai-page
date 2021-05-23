from . import db

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    pages = db.relationship('Page', backref='form', lazy=True)
    ocr_analysis_id = db.Column(db.Integer, db.ForeignKey('ocr_analysis.id'))
    
    def __repr__(self):
        return '<Form{}>'.format(self.id)