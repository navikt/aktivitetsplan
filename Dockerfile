FROM docker.adeo.no:5000/bekkci/npm-builder as npm-build
ADD / /source
RUN build

FROM docker.adeo.no:5000/fo/app-mock
RUN reset-mock-data

COPY --from=npm-build /example /web
COPY --from=npm-build /example/build/ /web
COPY --from=npm-build /example/build/ /web/aktivitetsplanfelles
# vis fram content - for debugging
RUN ls /web

LABEL SMOKETEST_CMD run-frontend-smoketest

