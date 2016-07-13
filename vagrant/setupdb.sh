#!/bin/bash

DB_USER=$(whoami)
DB_PASSWORD=$DB_USER
DB_NAME=wordmapper
BASEDIR=/vagrant

# Create postgres user + db 
sudo -u postgres psql -c "create user \"$DB_USER\" with password '$DB_PASSWORD'"
sudo -u postgres psql -c "create database \"$DB_NAME\" with owner \"$DB_USER\" encoding='utf8' template template0"
sudo service postgresql restart

# Run migrations
export DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
node $BASEDIR/wordmapper/server/src/migrate.js max
