FROM postgres:12-alpine
ENV POSTGRES_DB booking_dev
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password
COPY 002_initial_schema.sql 001_datadump.*  /docker-entrypoint-initdb.d/

