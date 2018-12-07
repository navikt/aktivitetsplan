# gjør det mulig å bytte base-image slik at vi får bygd både innenfor og utenfor NAV
ARG BASE_IMAGE_PREFIX="docker.adeo.no:5000/pus/"
FROM ${BASE_IMAGE_PREFIX}node as builder

ADD / /source
ENV CI=true
WORKDIR /source
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

FROM docker.adeo.no:5000/pus/decorator:145.20181201.2321 //TODO: revert til latest

# medfører 2 ting i pus-decorator:
#  - /environment.js-endepunktet legger public properties på window.aktivitetsplan
#  - applikasjonen får /aktivitetsplan som contextpath i begge soner
ENV APPLICATION_NAME=aktivitetsplan
COPY --from=builder /source/build /app

ADD proxy.json /proxy.json
ENV OIDC_LOGIN_URL /veilarbstepup/oidc
