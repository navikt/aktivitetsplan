FROM ghcr.io/navikt/poao-frontend/poao-frontend:2022.12.12_15.14-6d2623ef615d

COPY build /app/public

USER node
