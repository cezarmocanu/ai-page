from . import db
class TemplateImage(db.Model):
    __tablename__ = 'template_image'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Integer, nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('template_form.id'), nullable=False)