#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.5
    done

    echo "PostgreSQL started"
fi

if [ "$RABBIT" = "TRUE" ]
then
  while ! nc -z rabbitmq:5672; do
      sleep 0.5
  done

  echo "RabbitMQ started"
fi

if [ "$WEB" = "TRUE" ]
then
  python manage.py makemigrations
  python manage.py migrate
  python manage.py collectstatic --no-input --clear
  python manage.py initadmin
  python manage.py createstatuses
  python manage.py test
fi

exec "$@"
