FROM docker.adeo.no:5000/bekkci/npm-builder

ARG DOCKER_HOST
RUN docker ps

ADD / /source
RUN build

FROM docker.adeo.no:5000/fo/app-mock
RUN reset-mock-data

# slett evt mock-data for aktivitetsplanfelles
RUN rm -rf /web/aktivitetsplanfelles

ADD /example /web
ADD /example/build/ /web
ADD /example/build/ /web/aktivitetsplanfelles

# vis fram content - for debugging
RUN ls /web

LABEL SMOKETEST_CMD run-frontend-smoketest

