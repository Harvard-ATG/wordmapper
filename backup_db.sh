#!/bin/bash

D=`date +%Y-%m-%d`
F="wordmapper-db-$D.psql"
T="/tmp"
FF="$T/$F"
FFG="$FF.gz"
DB="wordmapper"
cd $T
pg_dump $D > $FF
gzip $FF
aws glacier upload-archive --account-id -  --vault-name wordmapper --body $FFG

