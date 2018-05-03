# Aktivitetsplan GUI Tester

### Oppsett
Chrome browser må være installert på maskinen
  
### Kjøre tester lokalt:
npm run test:e2e 

Aktivitetsplan vil kjøres opp med mock så man må stoppe kjørende instanser først.

#### Kjøre med headless browser
Man kan bestemme om chrome kjøres headless vha "--headless" argumentet
under chromeOptions.args i default.conf.js

#### Filtrere tester
Hver av filene med tester har unike tags som man kan benytte for å styre hvilke tester som skal kjøres.
Eksempel: For å kjøre kun dialogtester, legg til "--tag dialog" i test:e2e script i package.json


