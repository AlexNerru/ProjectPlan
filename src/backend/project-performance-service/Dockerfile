# pull official base image
FROM python:3.8.0-alpine

WORKDIR /usr/src/project-performance-service

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
COPY ./Pipfile /usr/src/project-performance-service/Pipfile
COPY ./Pipfile.lock /usr/src/project-performance-service/Pipfile.lock

RUN pipenv install --system --deploy --ignore-pipfile

COPY . /usr/src/project-performance-service

# copy project
RUN chmod +x /usr/src/project-performance-service/entrypoint.sh

# run entrypoint.sh
ENTRYPOINT ["/usr/src/project-performance-service/entrypoint.sh"]