docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
sleep 30
echo "Waited"
docker exec -d project-service sh -c "python manage.py create_queues"
docker exec -d project-performance-service sh -c "python manage.py create_queues"