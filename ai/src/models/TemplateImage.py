from . import db

class TemplateImage(db.Model):
    __tablename__ = 'template_image'
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.LargeBinary, nullable=False)
    # page = db.relationship('Page', uselist=False, backref='template_image')