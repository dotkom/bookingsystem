#!/bin/sh
echo "Password is: password"
pg_dump -a -h localhost -U postgres -p 5018 booking_dev > datadump.sql

#The implmentation below should be better because it does not assume that you have postgresql on the host service. 
#it is currently not working, would have to use pg_dumpall to function as intended, this will not allow the DockerImage to start.

#docker exec -t bookingsystem_db pg_dump -c -U postgres > datadump.sql
echo "Dump completed"