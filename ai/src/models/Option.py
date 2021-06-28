from . import db
class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(128), nullable=False)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    w = db.Column(db.Integer, nullable=False)
    h = db.Column(db.Integer, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    verified = db.Column(db.Boolean, default = False, nullable=False)
    # extractions = db.relationship('Extraction', backref='option', cascade="all,delete",lazy=True)