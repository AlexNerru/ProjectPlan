# pull official base image
FROM python:3.8.0-alpine

WORKDIR /usr/src/resource-service

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev jpeg-dev zlib-dev

# install dependencies
RUN pip install --upgrade pip
RUN pip install pipenv
#RUN pipenv lock --keep-outdated --requirements > requirements.txt
#RUN pip install --no-cache-dir -r requirements.txt
COPY ./Pipfile /usr/src/resource-service/Pipfile
COPY ./Pipfile.lock /usr/src/resource-service/Pipfile.lock

RUN pipenv install --system --deploy --ignore-pipfile

COPY . /usr/src/resource-service

# copy project
RUN chmod +x /usr/src/resource-service/entrypoint.sh

# run entrypoint.sh
ENTRYPOINT ["/usr/src/resource-service/entrypoint.sh"]