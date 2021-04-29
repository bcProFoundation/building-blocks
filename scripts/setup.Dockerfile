FROM python:alpine

COPY setup-wizard /opt/setup/setup-wizard
RUN python -m venv /opt/setup/env \
  && /opt/setup/env/pip install --upgrade pip requests

CMD [ "/opt/setup/env/python", "/opt/setup/setup-wizard" ]
