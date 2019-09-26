docker build -t booking_pg_image .
mkdir -p persistent_db
docker run --rm --name bookingsystem_db -e POSTGRES_DB=booking_dev -e POSTGRES_PASSWORD=password -d -p 5018:5432 -v ${PWD}/persistent_db:/var/lib/postgresql/data booking_pg_image