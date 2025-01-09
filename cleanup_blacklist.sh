#!/bin/bash

# Get the current timestamp in the format PostgreSQL expects
CURRENT_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

SQL_COMMAND="DELETE FROM $TABLE_NAME WHERE expires_at < '$CURRENT_TIMESTAMP';"

docker exec -e PGPASSWORD=$DB_PASSWORD $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "$SQL_COMMAND"

echo "Expired tokens successfully deleted from $TABLE_NAME."