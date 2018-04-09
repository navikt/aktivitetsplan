# Aktivitetsplan GUI Tester

### Oppsett
Chrome browser må være installert på maskinen
  
### Kjøre tester lokalt:
Kjør opp 
npm run dev:mock 
npm run nightwatch

Hvis man vil kjøre tester på hele integrasjonen:
Gå til default.conf.js, endre porten i baseUrl og fnr(må være et fnr for bruker under oppfølging)
Kjør npm run dev
Kjør npm run nightwatch

#### Kjøre med headless browser
Man kan kjøre tester med headless browser ved å legge til "--headless"
under chromeOptions.args i default.conf.js

#### Filtrere tester
Hver av filene med tester har unike tags som man kan benytte for å styre hvilke tester som skal kjøres.
Eksempel: For å kjøre kun dialogtester, legg til "--tag dialog" i nightwatch script i package.json


