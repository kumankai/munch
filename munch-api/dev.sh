#!/bin/bash

# Load dev environment variables
export $(cat .env.dev | xargs)

# Start development database if not running
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "db.*running"; then
    echo "Starting development database..."
    docker-compose -f docker-compose.dev.yml up -d
fi

flask run --debug