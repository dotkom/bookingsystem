FROM postgres:alpine
ENV POSTGRES_DB booking_dev
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password
COPY 001_initial_schema.sql /docker-entrypoint-initdb.d/
COPY datadump.sql /docker-entrypoint-initdb.d/
EXPOSE 5018
