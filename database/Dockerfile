FROM postgres:11.5-alpine
ENV POSTGRES_DB booking_dev
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password
COPY 001_initial_schema.sql datadump.* /docker-entrypoint-initdb.d/
EXPOSE 5018
