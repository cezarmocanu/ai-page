from . import db

class Extraction(db.Model):
    __tablename__ = 'extraction'
    id = db.Column(db.Integer, primary_key=True)
    option_id = db.Column(db.Integer, nullable=False)
    topic_id = db.Column(db.Integer, nullable=False)
    extracted_page_id = db.Column(db.Integer, db.ForeignKey('extracted_page.id'), nullable=False)