#!/bin/bash

# create python virtual environment
python -m venv env
. ./env/bin/activate

# install dependencies
setup_script_dir="$(dirname "$0")"
pip install --upgrade pip
pip install -r $setup_script_dir/requirements.txt
