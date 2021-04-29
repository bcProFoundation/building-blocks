FROM python:alpine

COPY setup-wizard /opt/setup/setup-wizard
RUN python -m venv /opt/setup/env \
  && /opt/setup/env/bin/pip install --upgrade pip requests

CMD [ "/opt/setup/env/bin/python", "/opt/setup/setup-wizard" ]
