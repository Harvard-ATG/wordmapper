#!/bin/bash
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
# Usage:
# 
# 	$ bash backup-db.sh
#

TODAY=`date +%Y-%m-%d`
FILE_NAME="wordmapper-db-$TODAY.psql"
FILE_PATH="/tmp/$FILE_NAME"
FILE_ARCHIVE="$FILE_PATH.gz"
DATABASE_URL="postgres://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE"
VAULT_NAME="$PGDATABASE"
ARCHIVE_DESCRIPTION="Wordmapper database backup for $TODAY"

echo "Starting backup process..."
	
echo "--> Dumping database [$DATABASE_URL] to [$FILE_PATH]"
if pg_dump $DATABASE_URL > $FILE_PATH; then
	echo "...success."
else
	echo "...failed. Aborting."
	exit $?
fi

echo "--> Creating archive $FILE_ARCHIVE"
if gzip $FILE_PATH; then
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
