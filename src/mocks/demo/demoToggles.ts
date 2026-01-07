import {
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    erEskalertBruker,
    erEskalertBrukerGammel, erIkkeRegistrertIKRR,
    erKRRBruker,
    erManuellBruker,
    erPrivatBruker,
    erUnder18,
    forhaandsvisningFeiler,
    ikkeLoggetInnNivaa4,
    ingenOppfPerioder,
    journalforingFeiler, kanIkkeVarsles,
    LocalStorageElement,
    maalFeilet,
    nivaa4Feilet,
    oppdateringKunFeiler,
    oppfFeilet,
    ulesteDialoger,
    visArenaAktiviteter,
    visAutomatiskeAktiviteter,
    visTestAktiviteter,
    visEksterneAktiviteter, sendTilBrukerFeiler
} from './localStorage';

export const brukertype = {
    ekstern: 'eksternbruker',
    veileder: 'veilederbruker',
};

export const radios = [
    {
        label: 'Veileder',
        id: brukertype.veileder,
        value: brukertype.veileder,
    },
    {
        label: 'Eksternbruker',
        id: brukertype.ekstern,
        value: brukertype.ekstern,
    },
];
export const features = [
    {
        label: 'Ikke under oppfølging',
        id: LocalStorageElement.PRIVAT_BRUKER,
        checked: erPrivatBruker,
    },
    {
        label: 'Manuell',
        id: LocalStorageElement.MANUELL_BRUKER,
        checked: erManuellBruker,
    },
    {
        label: 'Er reservert i KRR',
        id: LocalStorageElement.KRR_BRUKER,
        checked: erKRRBruker,
    },
    {
        label: 'Ikke innlogget med nivå 4',
        id: LocalStorageElement.INNLOGGET_NIVAA4,
        checked: ikkeLoggetInnNivaa4,
    },
    {
        label: 'Ingen oppfølgingsperioder',
        id: LocalStorageElement.INGEN_OPPF_PERIODER,
        checked: ingenOppfPerioder,
    },
    {
        label: 'Gammel eskaleringsvarsel',
        id: LocalStorageElement.GAMMEL_ESKALERT_BRUKER,
        checked: erEskalertBrukerGammel,
    },
    {
        label: 'Eskaleringsvarsel',
        id: LocalStorageElement.ESKALERT_BRUKER,
        checked: erEskalertBruker,
    },
    {
        label: 'Uleste dialoger',
        id: LocalStorageElement.ULESTE_DIALOGER,
        checked: ulesteDialoger,
    },
    {
        label: 'Under 18 år',
        id: LocalStorageElement.UNDER18,
        checked: erUnder18,
    },
    {
        label: 'Kan ikke varsles',
        id: LocalStorageElement.KAN_IKKE_VARSLES,
        checked: kanIkkeVarsles,
    },
    {
        label: 'Ikke registrert i KRR',
        id: LocalStorageElement.ER_IKKE_REGISTRERT_I_KRR,
        checked : erIkkeRegistrertIKRR,
    },
];
export const aktivitetTilstand = [
    {
        label: 'Automatiske aktiviteter',
        id: LocalStorageElement.AUTOMATISKE_AKTIVITETER,
        checked: visAutomatiskeAktiviteter,
    },
    {
        label: 'Arenaaktiviteter',
        id: LocalStorageElement.ARENA_AKTIVITETER,
        checked: visArenaAktiviteter,
    },
    {
        label: 'Testaktiviteter',
        id: LocalStorageElement.TEST_AKTIVITETER,
        checked: visTestAktiviteter,
    },
    {
        label: 'Eksterne aktiviteter',
        id: LocalStorageElement.EKSTERNE_AKTIVITETER,
        checked: visEksterneAktiviteter,
    },
];
export const feiltilstander = [
    {
        label: 'Oppfølging feiler',
        id: LocalStorageElement.OPPF_FEILET,
        checked: oppfFeilet,
    },
    {
        label: 'Dialog feiler',
        id: LocalStorageElement.DIALOG_FEILET,
        checked: dialogFeilet,
    },
    {
        label: 'Aktivitet feiler',
        id: LocalStorageElement.AKTIVITET_FEILET,
        checked: aktivitetFeilet as () => boolean,
    },
    {
        label: 'Arena feiler',
        id: LocalStorageElement.ARENA_FEILET,
        checked: arenaFeilet,
    },
    {
        label: 'Mål feiler',
        id: LocalStorageElement.MAAL_FEILET,
        checked: maalFeilet,
    },
    {
        label: 'Kun oppdatering feiler',
        id: LocalStorageElement.OPPDATERING_KUN_FEILER,
        checked: oppdateringKunFeiler,
    },
    {
        label: 'Nivå 4 feiler',
        id: LocalStorageElement.NIVAA4_FEILET,
        checked: nivaa4Feilet,
    },
    {
        label: 'Forhåndsvisning feiler',
        id: LocalStorageElement.FORHAANDSVISNING_FEILER,
        checked: forhaandsvisningFeiler,
    },
    {
        label: 'Jounalføring feiler',
        id: LocalStorageElement.JOURNALFORING_FEILER,
        checked: journalforingFeiler,
    },
    {
        label: 'Send til bruker feiler',
        id: LocalStorageElement.SEND_TIL_BRUKER_FEILER,
        checked: sendTilBrukerFeiler,
    },
];
