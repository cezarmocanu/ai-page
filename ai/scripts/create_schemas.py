import os
###this should not be called from inside src
###modyfi script accordingly

MODELS_DIR = r'src/models'
SCHEMA_DIR = r'src/schemas'

INIT_TEMPLATE="""
from flask_marshmallow import Marshmallow
ma = Marshmallow()
"""

SCHEMA_TEMPLATE = """from models import {model}
from . import ma
    
class {model}Schema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = {model}
"""

DICT_TEMPLATE = """
    '{model}': {bs}
        'single': {single_instance},
        'many': {many_instance}
    {be},
"""

models = os.listdir(MODELS_DIR)
models = map(lambda filename: filename.split('.')[0], models)
models = filter(lambda filename: filename != '__init__', models)

imports = ''
instances = ''

for model in models:
    schema_file = open('{}/{}.py'.format(SCHEMA_DIR, model), 'w+')
    schema_file.write(SCHEMA_TEMPLATE.format(model=model))
    schema_file.close()
    model_schema='{}Schema'.format(model)
    imports += '\nfrom .{model} import {model_schema}'.format(model=model,model_schema=model_schema)
    
    single_instance = '{model_schema}()'.format(model_schema=model_schema)
    many_instance = '{model_schema}(many=True)'.format(model_schema=model_schema)
    instances += DICT_TEMPLATE.format(model=model,single_instance=single_instance,many_instance=many_instance, bs='{',be='}')

    
INIT_TEMPLATE += '\n{}'.format(imports)
INIT_TEMPLATE += '\nSCHEMAS={bs}{instances}{be}'.format(instances=instances, bs='{',be='}')
    
INIT_TEMPLATE += """

def dump(object):
    if(type(object).__name__ == 'InstrumentedList'):
        t = type(object[0]).__name__
        return SCHEMAS[t]['many'].dump(object)
    t = type(object).__name__
    return SCHEMAS[t]['single'].dump(object)
"""
init_file = open('{}/__init__.py'.format(SCHEMA_DIR), 'w+')
init_file.write(INIT_TEMPLATE)
init_file.close()
    