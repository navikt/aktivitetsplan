---
name: ukentlige-oppdateringer
description: Kjør ukentlige Dependabot-oppdateringer for dette pnpm/TypeScript-repoet og klargjør for merge til main
---

Du er en agent som utfører ukentlige avhengighetsoppdateringer for dette repoet. Dependabot har allerede åpnet PRer — din jobb er å samle dem på én branch, løse eventuelle problemer underveis, og klargjøre for menneskelig gjennomgang og merge.


## Kontekst om repoet

- **Pakkehåndterer**: `pnpm`
- **Linter**: ESLint (`pnpm run lint`)
- **Tester**: Vitest (`pnpm run test`)
- **Build**: Vite (`pnpm run build`)
- **CI/CD**: Deploy til dev skjer via `workflow_dispatch` — ikke nødvendig å deploye som en del av dette oppsettet


## Steg 1 — Finn ukenummer og opprett branch

```bash
WEEK=$(date +%V)
YEAR=$(date +%Y)
BRANCH="oppdateringer/uke-${WEEK}-${YEAR}"
git checkout main
git pull origin main
git checkout -b "$BRANCH"
echo "Branch opprettet: $BRANCH"
```


## Steg 2 — Hent og verifiser åpne Dependabot-PRer

```bash
gh pr list --author "app/dependabot" --state open --json number,title,headRefName,labels,author
```

### ⚠️ Sikkerhetssjekk før merge

**Verifiser for hver PR at:**
1. `author.login` er nøyaktig `app/dependabot` — ikke bare at tittelen ser riktig ut
2. Branch-navnet følger mønsteret `dependabot/<ecosystem>/<pakke>`
3. Endringer er begrenset til `package.json`, `pnpm-lock.yaml` eller workflow-filer

```bash
gh pr view <nr> --json author,headRefName,files \
  | jq '{author: .author.login, branch: .headRefName, files: [.files[].path]}'
```

**Ikke merge PRer som:**
- Har en annen avsender enn `app/dependabot`
- Inneholder endringer i andre filer enn `package.json`, `pnpm-lock.yaml` eller GitHub Actions-filer

### ⚠️ Migreringsguide ved major-versjonshopp — ALLTID før merge

Dersom en PR bumper et rammeverk til en **ny major-versjon**, **hent og les migreringsguiden** før du gjør tilpasninger.

| Rammeverk | Migreringsguide-URL |
|-----------|---------------------|
| React | `https://react.dev/blog` (søk etter «React <NY_MAJOR>») eller GitHub releases |
| Vite | `https://vitejs.dev/guide/migration` eller `MIGRATION.md` i Vite-repoet |
| Vitest | `https://vitest.dev/guide/migration` |
| TypeScript | `https://www.typescriptlang.org/docs/handbook/release-notes/overview.html` |
| ESLint | `https://eslint.org/docs/latest/use/migrate-to-<NY_MAJOR>` |

```bash
# Hent migreringsguide — eksempel Vite 7:
curl -sL "https://raw.githubusercontent.com/vitejs/vite/main/docs/guide/migration.md" | head -150

# Eksempel React 19:
curl -sL "https://raw.githubusercontent.com/reactjs/react.dev/main/src/content/blog/2024/12/05/react-19.md" | head -150
```

**Les spesielt etter:** `breaking`, `removed`, `renamed`, `requires`, `peer`, `migration`

### ⚠️ Kjente koblinger — sjekk disse ved major-bump

| Pakke som bumpes (major) | Sjekk mot | Hvorfor |
|---|---|---|
| `react` | `react-dom`, `@types/react`, andre react-biblioteker | Må ha identisk major-versjon |
| `vite` | `@vitejs/*`-plugins, `vitest` | Plugin-API endres mellom major-versjoner |
| `vitest` | Test-syntaks og mock-API i eksisterende tester | Major-bump kan endre assertion-API |
| `typescript` | TypeScript-features brukt i kodebasen | Ny major kan innføre stricter type-checking |

### Prioriter sikkerhets-PRer

```bash
gh pr list --author "app/dependabot" --state open --json number,title,labels \
  | jq '.[] | select(.labels[].name | test("security"))'
```

Sikkerhets-PRer (label `security`) merges **før** ordinære oppdateringer.

### Sorteringsrekkefølge

| Prioritet | Kategori |
|-----------|----------|
| 1 | GitHub Actions |
| 2 | TypeScript-typer (`@types/*`) |
| 3 | Testverktøy (`vitest`, `@vitest/*`) |
| 4 | Build-verktøy (`vite`, `@vitejs/*`) |
| 5 | Linting (`eslint`, `@eslint/*`) |
| 6 | Standalone verktøy (`typescript`, `@testing-library/*`) |
| 7 | React og rammeverk (`react`, `react-dom`) |
| 8 | Øvrige produksjonsavhengigheter |


## Steg 3 — Merge PRer

For hver PR i sorteringsrekkefølgen:

```bash
git fetch origin <dependabot-branch>
git merge origin/<dependabot-branch> --no-edit
```

Kjør verifisering etter hver PR (eller etter en gruppert Dependabot-PR):

```bash
pnpm i
pnpm run test
```

### Dersom `pnpm i` gir lockfile-konflikter

```bash
pnpm i --no-frozen-lockfile
git add pnpm-lock.yaml
git commit --amend --no-edit
```

### Dersom `package.json` har merge-konflikter

```bash
# Behold begge versjonene — høyeste vinner
# Kjør deretter:
pnpm i
pnpm run test
git add package.json pnpm-lock.yaml
git commit --amend --no-edit
```

### Dersom tester feiler

1. Les testoutputen nøye
2. Sjekk migreringsguiden for breaking changes
3. Gjør nødvendige tilpasninger: `git add -A && git commit -m "fix: tilpass tester etter <pakkenavn>-oppdatering"`
4. Hvis feilen krever større refaktorering: reverter pakken og logg i oppsummeringen

### Dersom build feiler

```bash
pnpm run build
```

1. Les buildfeilene (typefeil, API-endringer)
2. Gjør tilpasninger og commit fiksen
3. Hvis feilen ikke kan løses raskt: reverter pakken og logg

### Revertering

```bash
git revert HEAD --no-edit
```


## Steg 4 — Push branchen

```bash
git push origin "$BRANCH"
```

Vent til CI-bygget er ferdig og grønt:

```bash
gh run watch $(gh run list --branch "$BRANCH" \
  --json databaseId --jq '.[0].databaseId') --exit-status
```

Hvis CI feiler: analyser feilen, reverter aktuelle merger, og logg i oppsummeringen.
**Ikke lag PR mot main med rødt bygg.**


## Steg 5 — Lag en oppsummerings-PR

```bash
gh pr create \
  --title "Ukentlige oppdateringer uke ${WEEK}" \
  --body "$(cat <<'EOF'
## Ukentlige avhengighetsoppdateringer

Denne PRen samler alle Dependabot-oppdateringer for uken.

### Inkluderte oppdateringer
<!-- Liste over merget PRer med pakkenavn og versjoner -->

### Skippet oppdateringer
<!-- PRer som ikke ble inkludert, med begrunnelse -->

### Kodeendringer utover versjons-bump
<!-- Eventuelle migrasjonstilpasninger -->

### Verifisering
- [ ] Tester passerer (`pnpm run test`)
- [ ] CI-bygg er grønt
- [ ] Breaking changes er håndtert

Merge til `main` etter godkjenning.
EOF
)" \
  --base main \
  --head "$BRANCH"
```


## Steg 6 — Instruksjon til mennesket

```
✅ Branch klar: oppdateringer/uke-<uke-nr>-<år>

Neste steg:
1. Sjekk at CI-bygget på branchen er grønt (Actions-tab)
2. Gjennomgå PR-en og eventuelle kodeendringer
3. Godkjenn og merge PR-en mot main

Merget i denne runden:
<liste over pakker som ble oppdatert>

Skippet (krever manuell gjennomgang):
<liste over pakker som ikke ble inkludert, med begrunnelse>
```


## Feilscenarioer og håndtering

| Scenario | Handling |
|----------|----------|
| Merge-konflikt i `pnpm-lock.yaml` | Kjør `pnpm i --no-frozen-lockfile`, commit ny lockfile |
| Merge-konflikt i `package.json` | Behold høyeste versjon, kjør `pnpm i` |
| Testfeil pga. breaking change | Tilpass tester, commit — eller reverter og logg |
| Buildfeil pga. typefeil | Fiks typefeilen, commit — eller reverter og logg |
| React major uten matching `react-dom` | Sørg for at `react` og `react-dom` har identisk versjon |
| Dependabot-branch er utdatert | `gh pr comment <nr> --body "@dependabot rebase"` og vent |
