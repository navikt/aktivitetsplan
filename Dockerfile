# gjør det mulig å bytte base-image slik at vi får bygd både innenfor og utenfor NAV
ARG BASE_IMAGE_PREFIX="docker.adeo.no:5000/pus/"
FROM ${BASE_IMAGE_PREFIX}node as builder

ADD / /source
ENV CI=true
WORKDIR /source
RUN npm install && npm run build

FROM docker.adeo.no:5000/pus/decorator
ENV APPLICATION_NAME=aktivitetsplan
ENV APPRES_CMS_URL=https://appres.nav.no
COPY --from=builder /source/build /app
