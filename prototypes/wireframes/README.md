# Wireframes - Aktivitetsplan Design

## 📐 Om Wireframes

Denne mappen inneholder **low-fidelity wireframes** for alle hovedkonseptene i aktivitetsplanen. Wireframes fokuserer på:

- **Layout og struktur** (ikke farger og detaljer)
- **Innholdshierarki** (hva er viktigst?)
- **Navigasjon og flyt** (hvordan beveger brukeren seg?)
- **Funksjonelle elementer** (knapper, input, ikoner)

Wireframes brukes tidlig i designprosessen for å:
- ✅ Teste ideer raskt uten å investere i detaljert design
- ✅ Kommunisere konsepter til stakeholders
- ✅ Få tilbakemelding på layout før farger og styling
- ✅ Fokusere på funksjonalitet fremfor estetikk

## 📁 Filer

### Desktop Varianter
**`desktop-variants.html`**
- V1: Milepæl + Delmål
- V2: Fremdrift + Dialog
- V3: Dashboard
- V4: Kombinert (anbefalt)

Wireframe-elementer:
- Gråtoner og bokser (ingen farger)
- 2px borders for bokser
- Gråskraverte knapper og inputs
- Placeholder-tekst i [brackets]
- Annotasjoner (gul boks) for forklaringer

### Mobil Varianter
**`mobile-variants.html`**
- Samme 4 varianter tilpasset mobil
- 375px bredde (iPhone-størrelse)
- Touch-vennlige elementer
- Bottom navigation
- Simplified layouts

### Fulltidsplan
**`fulltidsplan-desktop.html`**
- Ukekalender-layout
- Time-for-time visning
- Grid med 7 dager
- Timeberegning
- For spesialprogrammer (KVP, Ungdomsprogram)

**`fulltidsplan-mobile.html`** (hvis opprettet)
- Dagvisning med swipe
- Kronologisk aktivitetsliste
- Dag-tabs
- Touch-optimalisert

## 🎨 Wireframe-stil

### Visuelle Elementer

```html
<!-- Boks -->
<div class="wf-box">
    Innhold
</div>

<!-- Knapp -->
<div class="wf-button">
    [Klikk her]
</div>

<!-- Tekst/input -->
<div class="wf-text">
    [Placeholder tekst]
</div>

<!-- Sirkel (ikon/avatar) -->
<div class="wf-circle">
    ✓
</div>

<!-- Progress bar -->
<div class="wf-progress">
    <div class="wf-progress-fill" style="width: 50%"></div>
</div>
```

### Farger (gråskala)
- `#333` - Mørk grå (viktige elementer)
- `#666` - Medium grå (borders, ikoner)
- `#999` - Lys grå (sekundære borders)
- `#ccc` - Veldig lys grå (bakgrunner)
- `#e0e0e0` - Off-white (headers, knapper)
- `#f5f5f5` - Nesten hvit (body bakgrunn)
- `white` - Hvit (bokser)

### Annotasjoner
Gule bokser med informasjon om designet:
```html
<div class="annotation">
    📐 WIREFRAME V1: Milepæl + Delmål - Fokus på...
</div>
```

## 🔍 Sammenligning: Wireframe vs High-Fidelity

| Aspekt | Wireframe | High-Fidelity Prototype |
|--------|-----------|------------------------|
| **Farger** | Gråskala | Full fargepalett |
| **Detaljer** | Minimale | Alle detaljer |
| **Interaktivitet** | Begrenset | Full funksjonalitet |
| **Fokus** | Layout, struktur | Look & feel |
| **Tid å lage** | Timer | Dager/uker |
| **Når** | Tidlig fase | Senere fase |
| **Formål** | Teste konsept | Teste opplevelse |

## 📊 Designelementer Forklart

### Desktop Wireframes

#### Milepæl-visning (V1)
- **Hovedmål-boks** øverst (3px border)
- **Delmål-pills** (tabs med border)
- **Tidslinje** med dots og linjer
- **Aktivitetskort** med status-badges
- **Progress bars** (hatched pattern)

#### Fremdrift-visning (V2)
- **2-kolonne layout** (2/3 + 1/3)
- **Fremdriftsindikator** med sirkler og linjer
- **Dialog-panel** til høyre
- **Meldingsbobler** (veileder vs bruker)
- **Handlingsknapper** i dialog

#### Dashboard (V3)
- **4-kolonne KPI grid**
- **Store tall** (28px font)
- **Ikoner** (sirkler med emoji)
- **3-kolonne layout** for seksjoner

#### Kombinert (V4)
- **Blanding** av elementer fra alle
- **Ekspanderbarer** (chevron-ikon)
- **Quick stats** (små kort)
- **Dialog-preview** inline

### Mobil Wireframes

#### Generelle Prinsipper
- **Single column** layout
- **Touch targets** minimum 44px
- **Bottom navigation** fast
- **Sticky headers**
- **Ekspanderbarer** for mer info

#### Dag-tabs (Fulltidsplan)
- **Horisontal scroll**
- **Aktiv state** (mørk bakgrunn)
- **Swipe-hint** (tekst + ikon)

## 🎯 Bruk av Wireframes

### I Møter
1. Vis wireframe først (fokus på struktur)
2. Diskuter layout og navigasjon
3. Få consensus på konsept
4. Deretter vis high-fidelity versjon

### I Brukertesting
1. Test wireframe med brukere først
2. "Tenk høyt"-protokoll
3. Identifiser forvirring om layout
4. Iterer raskt (enkelt å endre)
5. Gå til high-fidelity når layouten er OK

### Med Utviklere
1. Wireframes viser komponent-struktur
2. Enklere å estimere kompleksitet
3. Diskutere responsive breakpoints
4. Planlegge API-behov

## 🛠️ Hvordan Oppdatere

Wireframes er HTML-filer med inline CSS. For å endre:

1. Åpne `.html`-filen i editor
2. Finn relevant seksjon
3. Endre HTML-struktur eller CSS-klasser
4. Refresh i browser
5. **Ikke** bruk eksterne CSS-frameworks

### Eksempel: Legg til ny wireframe-variant

```html
<!-- V5: Ny Variant -->
<div id="wireframe-v5" class="wireframe-content hidden">
    <div class="annotation">
        📐 WIREFRAME V5: [Navn] - [Beskrivelse]
    </div>

    <div class="wf-box">
        [Innhold]
    </div>
</div>
```

Legg til tab:
```html
<span class="tab" onclick="showWireframe('v5')">V5: [Navn]</span>
```

## 📖 Relaterte Filer

I hovedmappen (`/prototypes/`):
- `design-alternatives-v2.html` - High-fidelity desktop
- `design-mobile.html` - High-fidelity mobil (4 varianter)
- `design-fulltidsplan-desktop.html` - High-fidelity fulltidsplan
- `design-fulltidsplan-mobile.html` - High-fidelity mobil fulltidsplan

## ✅ Sjekkliste for Nye Wireframes

Når du lager nye wireframes, sørg for:
- [ ] Bruker kun gråskala (ingen farger)
- [ ] Har annotasjon som forklarer konseptet
- [ ] Touch targets er minimum 44px (mobil)
- [ ] Placeholder-tekst er i [brackets]
- [ ] Fokuserer på layout, ikke detaljer
- [ ] Kan vises i browser uten dependencies
- [ ] Har kommentarer i HTML for klarhet

## 🎨 Tips

### Rask Prototyping
1. Kopier eksisterende wireframe
2. Endre struktur (ikke stil)
3. Behold samme CSS-klasser
4. Fokuser på "hva" ikke "hvordan"

### Fra Wireframe til High-Fi
1. Bruk wireframe som template
2. Behold HTML-struktur
3. Legg til farger og ikoner
4. Legg til interaktivitet (JavaScript)
5. Finjuster spacing og typography

## 📚 Ressurser

- [Wireframing 101](https://balsamiq.com/learn/articles/what-are-wireframes/)
- [Low-Fi vs High-Fi Prototypes](https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/)
- [HTML Wireframes](https://html5up.net/) - Eksempler

---

**Status:** ✅ 3 wireframe-filer opprettet
**Sist oppdatert:** 12. februar 2026
**Vedlikeholdes av:** UX-team
