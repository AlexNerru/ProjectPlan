docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
sleep 20
echo "Waited"
docker exec -d user-service sh -c "python manage.py setupbroker"
docker exec -d project-service sh -c "python manage.py setupbroker"
docker exec -d resource-service sh -c "python manage.py setupbroker"
docker exec -d project-performance-service sh -c "python manage.py setupbroker"
docker exec -d task-service sh -c "python manage.py setupbroker"