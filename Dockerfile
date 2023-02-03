FROM ghcr.io/navikt/poao-frontend/poao-frontend:2023.04.14_11.14-66f2c0b9e68b

COPY build/index.html /app/public/index.html
