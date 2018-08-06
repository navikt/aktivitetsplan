# Aktivitetsplan GUI Tester
  
### Lokal kjøring:
#### Oppsett
    Chrome browser må være installert på maskinen
    Aktivitetsplan vil kjøres opp med mock så man må stoppe kjørende instanser først.

#### Kjøring
    npm run test:e2e

#### Headless browser
    Man kan bestemme om chrome kjøres headless vha "--headless" argumentet under chromeOptions.args i default.conf.js

### Browserstack
#### Oppsett
    Man må ha en konto på browserstack.com som er koblet til organisasjonen.
    Invite kan man få fra adminbrukere @izisfro @pederpus
    Når man er logget inn så kan man finne brukernavn og key på automate.browserstack.com
    Miljøvariablene BROWSERSTACK_USER og BROWSERSTACK_KEY må settes til disse.

#### Kjøring
    npm run heroku-postbuild
    node example/server.js
    BROWSERSTACK_USER=user BROWSERSTACK_KEY=key npm run test:browserstack

    Skjermbilder fra kjøringen på de forskjellige browserne havner i mappen reports
