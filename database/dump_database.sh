#!/bin/sh

docker exec -t bookingsystem_db pg_dumpall -c -U postgres > datadump.sql
echo "Dump completed"