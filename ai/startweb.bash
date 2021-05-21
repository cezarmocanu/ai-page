#!/bin/bash
export FLASK_DEBUG=1 && export FLASK_ENV=development && export FLASK_APP=src/webapp.py && flask run --host=0.0.0.0