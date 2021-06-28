from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from .BirdeyeImage import BirdeyeImage
from .CollectedImage import CollectedImage
from .Collection import Collection
from .ExtractedPage import ExtractedPage
from .Extraction import Extraction
from .Option import Option
from .Page import Page
from .TemplateForm import TemplateForm
from .TemplateImage import TemplateImage
from .Topic import Topic


