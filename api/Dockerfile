FROM python:3.8.10-alpine

RUN pip install --upgrade pip
RUN apk update \
  && apk add \
    --no-cache build-base git gcc python3-dev linux-headers
    # musl-dev libffi-dev openssl-dev
#RUN pip install cryptography

ENV WORKDIR=/opt/covalent-python-api
WORKDIR $WORKDIR
COPY ./covalent-python-api/ .
RUN pip install -e .

ENV WORKDIR=/opt/btfdca_api
WORKDIR $WORKDIR

COPY ./requirements.txt .
COPY ./src ./src
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["flask", "run"]
