# Mobil Design Alternativer - Aktivitetsplan

## Oversikt

Denne prototypen viser **fire forskjellige mobildesign-varianter** for Aktivitetsplanen, basert på konseptene fra desktop-alternativene (`design-alternatives-v2.html`).

**Fil:** `design-mobile.html`

## Kontekst

Flertallet av NAV-brukere benytter mobil for aktivitetsplanen og dialogen, mens veiledere alltid jobber fra PC. Designet er derfor optimalisert for:
- Touch-vennlige interaksjoner (minimum 44x44px touch targets)
- Rask tilgang til dialog og varsler
- Kompakt visning av informasjon
- Progressiv avsløring av detaljer

## De Fire Variantene

### V1: Milepæl + Delmål
**Fokus:** Delmål-struktur og tidslinje

**Hovedfunksjoner:**
- Hovedmål øverst med tydelig fremdriftsmåler
- Horisontal scroll-bar med delmål-progresjon (✓ → 2 → 3 → 🎯)
- Langtidstiltak vises som "pågående bakgrunn" i egen boks
- Tidslinje med aktiviteter under aktivt delmål
- Visuell differensiering: fullført (grønn), pågående (oransje), planlagt (grå)
- Milepæler markert med større dot på tidslinjen

**Fordeler:**
- Klar struktur med delmål
- God oversikt over fremdrift
- Tidslinje gir kronologisk forståelse

### V2: Fremdrift med Dialog
**Fokus:** Dialog-integrasjon med preview

**Hovedfunksjoner:**
- Fremdriftsmåler med prosent-visning
- Uleste dialoger fremhevet i gul banner øverst
- Hver aktivitet kan ekspanderes for å vise dialog-preview
- Handlingsknapper direkte i dialog-preview ("Ja, gjerne" / "Ikke nå")
- Veileder-forslag kan besvares med ett trykk
- Ulest-telling per aktivitet

**Fordeler:**
- Rask tilgang til dialog uten å bytte view
- Handlingsknapper reduserer antall trykk
- Tydelig fokus på kommunikasjon

### V3: Dashboard
**Fokus:** KPI-oversikt og metrics

**Hovedfunksjoner:**
- 2x2 grid med KPI-kort (Delmål fullført, Pågående, Uleste, Tid til mål)
- Dedikert seksjon for pågående tiltak
- "Kommende hendelser" erstatter kalender
- Kompakt visning av hovedmål nederst
- Visuelt hierarki med ikoner og farger

**Fordeler:**
- Raskt overblikk over status
- Metrics-fokusert
- God for å se "big picture"

**Ulemper:**
- Mer informasjonstett
- Mindre fokus på individuelle aktiviteter

### V4: Kombinert (Anbefalt) ⭐
**Fokus:** Det beste fra alle varianter

**Hovedfunksjoner:**
- Fremdriftsmåler med delmål (fra V1)
- Quick stats banner med uleste/pågående/tid igjen (fra V3)
- Dialog-preview med handlingsknapper (fra V2)
- Langtidstiltak med ekspanderbar dialog
- Aktivitetsliste strukturert under delmål
- Uleste meldinger fremheves med badges og pulserende indikator

**Fordeler:**
- Balansert mellom oversikt og detalj
- Kombinerer styrker fra alle varianter
- Rask tilgang til både status og kommunikasjon
- Handlingsknapper for effektiv interaksjon

## Felles Funksjoner

Alle varianter deler:
- **Bottom navigation**: Oversikt, Varsler, Profil
- **Tab navigation**: Hjem, Aktivitet, Dialog, Varsler
- **Aktivitetsdetalj-modal**: iOS-style bottom sheet
- **Ekspanderbarer**: Kollapsede seksjoner for fullførte/fremtidige delmål
- **Design-notater**: Floating "?" knapp med forklaring

## Mobil-spesifikke Tilpasninger

### Touch-vennlighet
- Alle knapper minimum 44x44px
- God spacing mellom klikkbare elementer
- Swipe-hints der relevant

### Visuell Hierarki
- Pågående aktiviteter fremhevet med farger og borders
- Uleste meldinger med røde badges
- Milepæler/delmål med distinkte ikoner

### Progressiv Avsløring
- Ekspanderbarer for sekundær informasjon
- Bottom sheet for aktivitetsdetaljer
- Dialog-preview før full visning

### Kompakt Layout
- Horisontal scroll for delmål-progresjon
- Stacked informasjon i stedet for side-by-side
- Ikoner brukt i stedet for lange tekster der mulig

## Teknisk Implementasjon

### Variant-bytte
```javascript
function showDesignVariant(variantId) {
    // Skjuler alle home-views
    // Viser valgt variant
    // Oppdaterer tab-states
}
```

### View-navigasjon
```javascript
function showMobileView(viewId) {
    // Håndterer bytte mellom Hjem/Aktivitet/Dialog/Varsler
    // Respekterer aktiv variant
}
```

### Toggle-sections
```javascript
function toggleSection(sectionId) {
    // Ekspanderer/kollapser seksjoner
    // Roterer chevron-ikon
}
```

## Hvordan Teste

1. Åpne `design-mobile.html` i nettleser
2. Sett viewport til ca 375px bredde (iPhone-størrelse)
3. Bruk fane-knappene øverst for å bytte mellom V1-V4
4. Klikk på aktiviteter, dialoger, og ekspanderbarer
5. Test navigasjon med bottom bar og tabs

## Anbefaling

**V4: Kombinert** anbefales som utgangspunkt for videre utvikling fordi den:
- Gir god oversikt uten å ofre detaljer
- Integrerer dialog naturlig i flyten
- Reduserer antall trykk med handlingsknapper
- Balanserer behov for både brukere og veiledere
- Skalerer godt til både kort- og langtidsoppfølging

## Neste Steg

1. **Brukertesting**: Test alle varianter med reelle brukere
2. **A/B-testing**: Sammenlign engasjement på V2 vs V4
3. **Accessibility audit**: Sikre WCAG 2.1 AA compliance
4. **Performance**: Optimalisere for trege mobilnett
5. **Dark mode**: Implementere mørk modus
6. **Notifikasjoner**: Push notifications for nye meldinger
7. **Offline support**: Service worker for offline-tilgang

## Tilbakemelding

Bruk design-notater modal (? knapp nederst til høyre) for å se detaljert forklaring av design-beslutninger.
