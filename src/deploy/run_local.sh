docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d
sleep 80
echo "waited"
docker exec -d user-service sh -c "python manage.py setupbroker"
docker exec -d project-service sh -c "python manage.py setupbroker"
docker exec -d resource-service sh -c "python manage.py setupbroker"
docker exec -d project-performance-service sh -c "python manage.py setupbroker"
