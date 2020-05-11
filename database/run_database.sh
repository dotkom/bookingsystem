#!/bin/sh

docker build -t booking_pg_image .
docker run --rm --name bookingsystem_db -e POSTGRES_DB=booking_dev -e POSTGRES_PASSWORD=password -d -p 5432:5432 booking_pg_image
#! exposingP Port: Internal Port (The exposing must match the dockerfile)
