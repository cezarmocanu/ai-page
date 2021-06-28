
from flask_marshmallow import Marshmallow
ma = Marshmallow()


from .TemplateImage import TemplateImageSchema
from .Option import OptionSchema
from .BirdeyeImage import BirdeyeImageSchema
from .Page import PageSchema
from .CollectedImage import CollectedImageSchema
from .Extraction import ExtractionSchema
from .TemplateForm import TemplateFormSchema
from .Topic import TopicSchema
from .Collection import CollectionSchema
from .ExtractedPage import ExtractedPageSchema
SCHEMAS={
    'TemplateImage': {
        'single': TemplateImageSchema(),
        'many': TemplateImageSchema(many=True)
    },

    'Option': {
        'single': OptionSchema(),
        'many': OptionSchema(many=True)
    },

    'BirdeyeImage': {
        'single': BirdeyeImageSchema(),
        'many': BirdeyeImageSchema(many=True)
    },

    'Page': {
        'single': PageSchema(),
        'many': PageSchema(many=True)
    },

    'CollectedImage': {
        'single': CollectedImageSchema(),
        'many': CollectedImageSchema(many=True)
    },

    'Extraction': {
        'single': ExtractionSchema(),
        'many': ExtractionSchema(many=True)
    },

    'TemplateForm': {
        'single': TemplateFormSchema(),
        'many': TemplateFormSchema(many=True)
    },

    'Topic': {
        'single': TopicSchema(),
        'many': TopicSchema(many=True)
    },

    'Collection': {
        'single': CollectionSchema(),
        'many': CollectionSchema(many=True)
    },

    'ExtractedPage': {
        'single': ExtractedPageSchema(),
        'many': ExtractedPageSchema(many=True)
    },
}

def dump(object):
    if(type(object).__name__ == 'InstrumentedList'):
        t = type(object[0]).__name__
        return SCHEMAS[t]['many'].dump(object)
    t = type(object).__name__
    return SCHEMAS[t]['single'].dump(object)
