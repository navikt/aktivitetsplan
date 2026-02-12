# Sammenligning: Mobil vs Desktop Design Varianter

## Oversikt

| Konsept | Desktop (design-alternatives-v2.html) | Mobil (design-mobile.html) |
|---------|--------------------------------------|----------------------------|
| **V1: Milepæl + Delmål** | Tidslinje med sidepanel | Vertikal scroll med ekspanderbarer |
| **V2: Fremdrift + Dialog** | 2-kolonne layout (liste + dialog) | Dialog-preview i ekspanderbarer |
| **V3: Dashboard** | 4-kolonners KPI grid | 2x2 KPI grid |
| **V4: Kombinert** | Full bredde med alle elementer | Kompakt stacking med progressive disclosure |

## Hovedforskjeller

### Navigasjon

**Desktop:**
- Top navigation tabs
- Side-by-side visning
- Alltid synlig sidebar

**Mobil:**
- Bottom navigation bar
- Tab navigation øverst
- Single column layout
- Bottom sheet modals

### Interaksjon

**Desktop:**
- Hover states
- Drag & drop
- Simultane views (f.eks. aktiviteter + dialog)
- Keyboard shortcuts

**Mobil:**
- Touch gestures
- Swipe/tap
- Ett view av gangen
- Bottom sheet for detaljer
- Ekspanderbarer for secondary info

### Informasjonstetthet

**Desktop:**
- Mer informasjon synlig samtidig
- Bredere cards med mer detaljer
- Lange beskrivelser
- Større tabeller/lister

**Mobil:**
- Progressiv avsløring
- Kompakte cards
- Ikoner over tekst
- Kortere beskrivelser
- Badges for status

### Dialog-integrasjon

**Desktop (V2):**
- Fast dialog-panel til høyre
- Alltid synlig
- Full samtalehistorikk

**Mobil (V2 og V4):**
- Dialog-preview i aktivitetskort
- Ekspanderes ved behov
- "Se dialog →" for full visning
- Handlingsknapper for quick response

### Langtidstiltak

**Desktop:**
- Dedikert "pågående bakgrunn" seksjon
- Mer plass for detaljer
- Inline fremdriftsmålere

**Mobil:**
- Kompakt card øverst
- Ekspanderbar for dialog
- Progress bar integrert
- Badge med "Tiltak" label

## Bruk av Plass

### Desktop
- Utnytter horisontal plass
- Multi-kolonne layouts
- Sidebar navigation
- Større touch targets ikke nødvendig

### Mobil
- Vertikal scrolling
- Single column (unntatt KPI grid)
- Bottom navigation
- Minimum 44x44px touch targets
- Safe area insets for notch/home indicator

## Prioritering av Informasjon

### Desktop
Brukere (NAV ansatte/veiledere) trenger:
1. Full oversikt over alle aktiviteter
2. Rask tilgang til brukerprofil
3. Mulighet til å redigere/opprette aktiviteter
4. Se historikk og trender
5. Sammenligne brukere

### Mobil
Brukere (NAV-mottakere) trenger:
1. Se egen status raskt
2. Svare på meldinger fra veileder
3. Vite hva som er neste steg
4. Bekrefte/avkrefte aktiviteter
5. Legge til notater

## Anbefalinger for Implementasjon

### Responsive Breakpoints

```css
/* Mobil first */
.container { /* Mobil styling */ }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { /* Hybrid styling */ }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { /* Desktop styling */ }
}
```

### Feature Parity

**Desktop eksklusivt:**
- Bulk operations
- Advanced filters
- Detailed analytics
- Multi-user comparison
- Export functionality

**Mobil eksklusivt:**
- Push notifications
- Quick actions (swipe-to-complete)
- Voice input
- Camera integration (for dokumenter)
- Offline support

**Felles:**
- CRUD for aktiviteter
- Dialog/meldinger
- Kalender/møter
- Delmål tracking
- Milepæler

### Performance

**Desktop:** Kan laste mer data samtidig
**Mobil:** Lazy loading, progressive enhancement, mindre bundles

## Testing Strategy

1. **Desktop varianter**: User testing med veiledere på NAV-kontorer
2. **Mobil varianter**: User testing med NAV-brukere på mobil
3. **Cross-device**: Test at endringer synkroniseres korrekt
4. **Accessibility**: WCAG compliance på begge plattformer
5. **Performance**: Lighthouse scores, Core Web Vitals

## Konklusjon

Desktop og mobil-versjonene deler samme **konseptuelle fundament** (milepæl, fremdrift, dashboard, kombinert), men tilpasser seg dramatisk forskjellig til:
- Skjermstørrelse
- Input-metode (mus vs touch)
- Brukerkontekst (veileder på jobb vs bruker underveis)
- Informasjonsbehov (full oversikt vs personal status)

**V4 Kombinert** anbefales for begge plattformer som utgangspunkt, med platform-spesifikke tilpasninger.
