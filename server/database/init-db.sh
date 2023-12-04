#!/bin/bash
set -e


while ! pg_isready -h db -U username -d databasename; do
   sleep 1
done

# Execute the SQL script
psql -h db -U username -d databasename -f /scripts/learningPlanDB.psql