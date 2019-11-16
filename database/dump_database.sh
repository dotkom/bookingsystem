#!/bin/sh

docker exec -t bookingsystem_db pg_dump -h localhost -U postgres -p 5432 booking_dev > 001_datadump.sql
