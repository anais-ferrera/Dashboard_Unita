#!/bin/bash
docker-compose up --build
docker exec -it mongo_ingestion ./start.sh