# Fulltidsplan for Spesialprogrammer

## 🎯 Formål

Fulltidsplanen er designet for brukere som er på **spesielle NAV-programmer** som krever tett oppfølging og daglig planlegging:

- **Ungdomsprogrammet** (14-30 år)
- **Kvalifiseringsprogrammet (KVP)** (30-67 timer per uke)
- **Andre fulltidsprogrammer** med krav om strukturert dagsplan

Disse brukerne har ofte komplekse behov som kombinerer:
- Arbeidstrening/lønnstilskudd
- Utdanning/kurs
- Tett oppfølging fra NAV
- Egen jobbsøkingsaktivitet
- Gruppemøter og støtteaktiviteter

## 📁 Filer

- **`design-fulltidsplan-desktop.html`** - Desktop-versjon med ukekalender
- **`design-fulltidsplan-mobile.html`** - Mobil-versjon med dagvisning

## 🖥️ Desktop-versjon

### Hovedfunksjoner

#### 1. Ukekalender-layout
- **7-dagers oversikt** (mandag-søndag)
- **Time-for-time visning** (08:00-17:00)
- Lignende Google Calendar / Outlook Calendar
- Grid-basert layout med tidslinjer

#### 2. Program-informasjon
- **Program-badge** øverst (f.eks. "Ungdomsprogrammet")
- Tydelig visning av forventet antall timer per uke (37,5t)
- Progress-indikator for ukentlig timemål
- Veileder-informasjon

#### 3. Langtidstiltak-integrasjon
- Banner øverst som viser pågående tiltak (f.eks. "Lønnstilskudd")
- Planlagte timer per uke for tiltaket
- Tiltaket vises OGSÅ i kalenderen på de dagene det pågår
- Kobling til selve tiltaket for mer detaljer

#### 4. Aktivitetsblokker
Hver aktivitet vises som en blokk med:
- **Tittel** (f.eks. "Arbeid - Bakeri AS")
- **Tid** (f.eks. "09:00 - 13:00 • 4t")
- **Fargekoding** basert på type:
  - 🟠 Oransje: Arbeid/Tiltak
  - 🟢 Grønn: Utdanning/Kurs
  - 🔵 Blå: Møte med NAV
  - 🟣 Lilla: Jobbsøking (egen tid)
  - 🟡 Gul: Leksehjelp/Støtte
  - 🩷 Rosa: Gruppemøte

#### 5. Tidmarkør "nå"
- **Rød linje** som viser nåværende tidspunkt
- Oppdateres automatisk
- Hjelper bruker å se hva som er "nå" vs fremtidig

#### 6. Interaktivitet (planlagt)
- **Drag-and-drop** for å flytte aktiviteter
- **Klikk på time-slot** for å legge til ny aktivitet
- **Resize** for å endre varighet
- **Konfliktsjekk** (varsler ved overlapp)

#### 7. Ukeoppsummering
Tre kort nederst:
- **Timer denne uke**: 32,5 / 37,5 (med progress bar)
- **Aktivitetstyper**: Breakdown per type (Arbeid 20t, Utdanning 8t, etc.)
- **Kommende hendelser**: Liste over neste møter/aktiviteter

#### 8. Navigasjon
- **Uke-navigasjon**: Forrige/neste uke, "I dag"-knapp
- **View-toggle**: Ukeplan, Oversikt, Alle aktiviteter, Dialog
- Tilbake til vanlig aktivitetsplan

### Tekniske detaljer

**Layout:**
```css
grid-cols-[80px_repeat(7,1fr)]
```
- 80px for tidslinje (venstre kolonne)
- 7 like store kolonner for dagene

**Fargekoder:**
- Orange (#f97316): Arbeid/Tiltak
- Green (#22c55e): Utdanning
- Blue (#3b82f6): NAV-møter
- Purple (#a855f7): Jobbsøking
- Yellow (#eab308): Leksehjelp
- Pink (#ec4899): Gruppemøte

## 📱 Mobil-versjon

### Hovedforskjeller fra Desktop

#### 1. Dagvisning (ikke ukevisning)
- Viser **én dag av gangen**
- Unngår horisontal scrolling
- Bedre oversikt på liten skjerm

#### 2. Dag-tabs med swipe
- Scrollbar med dag-faner øverst
- **Swipe venstre/høyre** for å bytte dag
- Hver fane viser:
  - Ukedag (f.eks. "Tir")
  - Dato (f.eks. "11")
  - Timer (f.eks. "6,5t")

#### 3. Kronologisk aktivitetsliste
- Aktiviteter vises som kort (ikke kalender-grid)
- Sortert fra tidligst til senest
- Fargekode med **4px stripe** på venstre side

#### 4. Status-badges
- ✓ **Fullført** (grønn)
- ▶ **Pågår** (oransje, animert)
- **Planlagt** (grå)

#### 5. "Nå"-markør
- Sticky banner øverst i listen
- "Klokken er nå 10:30" med rød prikk
- Vises kun på dagens dato

#### 6. Quick actions
Direkte på aktivitetskort:
- **"Åpne lenke"** (for online-kurs)
- **"Start aktivitet"** (for egen aktivitet)
- **"Se detaljer"** (åpner modal)

#### 7. Ukeoppsummering (sticky bottom)
- Ekspanderbar panel over bottom nav
- Timer, progress bar, aktivitetstyper
- Alltid tilgjengelig uten å scrolle

#### 8. Touch-optimalisert
- Minimum 44x44px touch targets
- Swipe-gestures for dagbytte
- Bottom sheet-modaler
- Stor tekst og spacing

### Tekniske detaljer

**Swipe-implementasjon:**
```javascript
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});
```

**Aktivitetskort:**
```html
<div class="activity-card work">
  <!-- 4px stripe med ::before pseudo-element -->
  <div class="font-semibold">Tittel</div>
  <div class="text-xs">Tid</div>
  <button>Action</button>
</div>
```

## 🔄 Integrasjon med Eksisterende Aktivitetsplan

### 1. Tiltak og ordinære aktiviteter
Fulltidsplanen viser **både**:
- Ordinære aktiviteter (møter, kurs, jobbsøking)
- Langtidstiltak (lønnstilskudd, arbeidstrening)
- KVP-aktiviteter (hvis bruker er på KVP)

### 2. Synkronisering
- Aktiviteter opprettet i fulltidsplanen vises i hovedplanen
- Aktiviteter fra hovedplanen kan dras inn i fulltidsplanen
- Endringer synkroniseres begge veier

### 3. Dialog-integrasjon
- Hver aktivitet har tilknyttet dialog med veileder
- Uleste meldinger vises med badge
- Bottom nav har dialog-knapp

### 4. Varsler
- SMS/push-notifikasjon kvelden før (påminnelse)
- Notifikasjon 15 min før aktivitet starter
- Ukentlig oppsummering (søndag kveld)

## 📊 Timeberegning

### Automatisk telling
Systemet beregner automatisk:
- **Timer per dag** (vises i dag-header)
- **Timer per uke** (vises i oppsummering)
- **Progresjon mot ukemål** (f.eks. 32,5 / 37,5 timer)

### Visuell feedback
- 🟢 Grønn: Over ukemål (>100%)
- 🟠 Oransje: Under ukemål (80-99%)
- 🔴 Rød: Langt under ukemål (<80%)

### Kategorisering
Timene kategoriseres etter type:
- Arbeid (lønnstilskudd, arbeidstrening)
- Utdanning (skole, kurs)
- NAV-møter (veiledning, oppfølging)
- Egen aktivitet (jobbsøking, leksehjelp)
- Gruppemøter

## 🎨 Brukskasus

### Eksempel 1: Ungdomsprogrammet
**Kari, 19 år:**
- Går på videregående (10t/uke)
- Lønnstilskudd hos bakeri (20t/uke)
- Ukentlig veiledning (1t/uke)
- Jobbsøkingsaktivitet (4t/uke)
- Gruppemøte ungdom (2t/uke)

**Totalt:** 37 timer/uke

### Eksempel 2: KVP
**Per, 45 år:**
- Arbeidstrening hos lager (25t/uke)
- Norsk-kurs (6t/uke)
- Økonomirådgivning (2t/uke)
- Fysisk aktivitet (3t/uke)
- Oppfølgingsmøter (2t/uke)

**Totalt:** 38 timer/uke

## 🚀 Implementering

### Fase 1: Grunnfunksjonalitet
- [x] Ukekalender-visning (desktop)
- [x] Dagvisning med swipe (mobil)
- [x] Fargekoding per type
- [x] Timeberegning
- [ ] CRUD for aktiviteter

### Fase 2: Interaktivitet
- [ ] Drag-and-drop (desktop)
- [ ] Modal for aktivitetsdetaljer
- [ ] Konfliktsjekk
- [ ] Quick actions (mobil)

### Fase 3: Integrasjon
- [ ] Synkronisering med hovedplan
- [ ] Dialog-integrasjon
- [ ] Tiltak-integrasjon
- [ ] KVP-støtte

### Fase 4: Avansert
- [ ] SMS/Push-varsler
- [ ] Eksport til kalender (iCal/Google)
- [ ] Ukerapport (PDF)
- [ ] Statistikk og trendanalyse
- [ ] Bulk-operasjoner (kopier uke, mal)

## 📋 Datamapping

### Aktivitet-objekt
```typescript
interface FulltidsplanAktivitet {
  id: string;
  tittel: string;
  beskrivelse?: string;
  fraDato: Date; // Med klokkeslett
  tilDato: Date; // Med klokkeslett
  type: AktivitetType; // Påvirker farge
  status: 'PLANLAGT' | 'PAAGAAR' | 'FULLFOERT' | 'AVBRUTT';
  programId: string; // KVP, Ungdomsprogram, etc.
  tiltakId?: string; // Hvis del av tiltak
  veileder: string;
  lokasjon?: string;
  lenke?: string; // For online-aktiviteter
  dialog: Dialog[]; // Tilknyttede meldinger
}
```

### Program-objekt
```typescript
interface Spesialprogram {
  id: string;
  type: 'UNGDOMSPROGRAM' | 'KVP' | 'ANNET';
  navn: string;
  fraDato: Date;
  tilDato: Date;
  timemal: number; // F.eks. 37.5
  veileder: string;
  beskrivelse: string;
}
```

## 🔍 Forskjell fra Ordinær Aktivitetsplan

| Aspekt | Ordinær Plan | Fulltidsplan |
|--------|-------------|--------------|
| **Visning** | Liste/tavle | Ukekalender |
| **Tidspresisjon** | Dato | Tid (timer/minutter) |
| **Målgruppe** | Alle NAV-brukere | Spesialprogrammer |
| **Timeberegning** | Nei | Ja (automatisk) |
| **Ukemål** | Nei | Ja (f.eks. 37,5t) |
| **Daglig plan** | Nei | Ja |
| **Fargekoding** | Status | Type |
| **Layout** | Delmål-fokusert | Tidslinje-fokusert |

## 💡 Designbeslutninger

### Hvorfor ukekalender?
- Gir oversikt over hele uken
- Lett å se mønstre og rutiner
- Kjent format (Google Calendar)
- Enkel å planlegge fremover

### Hvorfor dagvisning på mobil?
- Unngår horisontal scroll
- Fokuserer på "i dag" og "i morgen"
- Mer handlingsorientert
- Mindre kognitiv belastning

### Hvorfor timeberegning?
- KVP krever 30-67 timer/uke
- Ungdomsprogram krever fulltid
- Viktig for ytelser/oppfølging
- Motiverende å se progresjon

### Hvorfor fargekoding?
- Raskere visuell scanning
- Enklere å se balanse mellom typer
- Universell forståelse
- Accessibility-vennlig (med ikoner også)

## 🧪 Testing

### Brukertesting
1. **Ungdom (16-25 år):**
   - Forstår de fulltidsplanen?
   - Klarer de å legge til aktiviteter?
   - Er mobil-versjonen intuitiv?

2. **KVP-brukere (voksne):**
   - Fungerer timeberegningen?
   - Er ukekalenderen oversiktlig?
   - Forstår de fargekodene?

3. **Veiledere:**
   - Kan de følge opp brukerne?
   - Ser de raskt om ukemål nås?
   - Fungerer dialog-integrasjonen?

### Teknisk testing
- [ ] Responsiv på alle skjermstørrelser
- [ ] Touch-funksjonalitet (swipe, tap)
- [ ] Ytelse med 50+ aktiviteter
- [ ] Offline-støtte
- [ ] Accessibility (WCAG 2.1 AA)

## 📚 Referanser

- [Kvalifiseringsprogram - nav.no](https://www.nav.no/kvp)
- [Ungdomsinnsats - nav.no](https://www.nav.no/ung)
- Google Calendar design patterns
- iOS Calendar app
- Outlook Calendar

## 🎯 Suksesskriterier

1. **90%+ av brukere** forstår fulltidsplanen første gang
2. **Redusert antall** henvendelser om "hva skal jeg gjøre i dag"
3. **Økt måloppnåelse** for ukentlige timekrav
4. **Positive tilbakemeldinger** fra både brukere og veiledere
5. **Høy engasjement**: Daglig bruk for 80%+ av programbrukere

---

**Status:** ✅ Prototype ferdig
**Neste steg:** Brukertesting med ungdom og KVP-brukere
**Ansvarlig:** UX-team + produkteier
