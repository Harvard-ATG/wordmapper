#!/bin/bash
#
# DESCRIPTION
# -----------
#
# This script performs a backup of the postgres database by doing a 
# `pg_dump` of the postgres database and uploading the gzipped dump
# file to an AWS Glacier vault. 
#
# SETUP
# -----
#
# In order for this script to work, set the following environment 
# variables in your shell:
#
# 	PGHOST
# 	PGPORT
# 	PGDATABASE
# 	PGUSER
# 	PGPASSWORD
#
# Then add a script like the following to /etc/cron.{daily,weekly} to 
# enable backups on a daily or weekly basis:
#
#	#!/bin/bash
#	/bin/su - ubuntu -s /bin/bash -c "/home/ubuntu/wordmapper/backup_db.sh"
# 
# USAGE
# -----
# 
# 	$ ./backup-db.sh
#

TODAY=`date +%Y-%m-%d`
FILE_NAME="wordmapper-db-$TODAY.psql"
FILE_PATH="/tmp/$FILE_NAME"
FILE_ARCHIVE="$FILE_PATH.gz"
DATABASE_URL="postgres://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE"
VAULT_NAME="$PGDATABASE"
ARCHIVE_DESCRIPTION="Wordmapper database backup for $TODAY"

if [ ! -n "$PGDATABASE" ]; then
	echo "Missing postgres 'PG' environment variables required to execute backup. Aborting."
	exit 1
fi

echo "Starting backup process..."
	
echo "--> Dumping database [$DATABASE_URL] to [$FILE_PATH]"
if pg_dump $DATABASE_URL > $FILE_PATH; then
	echo "...success."
else
	echo "...failed. Aborting."
	exit $?
fi

echo "--> Creating archive $FILE_ARCHIVE"
if /bin/rm -f "$FILE_ARCHIVE" && gzip "$FILE_PATH"; then
	echo "...success."
else
	echo "...failed. Aborting."
	exit $?
fi

echo "--> Uploading archive to AWS Glacier"
if aws glacier upload-archive --account-id -  --vault-name $VAULT_NAME --archive-description "$ARCHIVE_DESCRIPTION" --body $FILE_ARCHIVE ; then
	echo "...success."
else
	echo "...failed.  Aborting."
	exit $?
fi

echo "Backup process complete."
