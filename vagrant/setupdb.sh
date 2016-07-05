#!/bin/bash

USER=$(whoami)
BASEDIR=/vagrant
PGPASSWORD=$USER

# Create postgres user + db 
sudo -u postgres psql -c "create user \"$USER\" with password '$PGPASSWORD'"
sudo -u postgres psql -c "create database \"wordmapper\" with owner \"$USER\" encoding='utf8' template template0"
sudo service postgresql restart
psql -U $USER -d wordmapper -f $BASEDIR/wordmapper/server/schema_pg.sql