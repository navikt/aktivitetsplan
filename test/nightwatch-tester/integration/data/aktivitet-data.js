import { getRelativeDatePrettyPrint, toDatePrettyPrint } from '../date-utils';
import { AktivitetStatus } from './aktivitet-status';
import { AktivitetsType } from './aktivitet-type';
import { AktivitetTilstand } from './aktivitet-tilstand';

export class AktivitetData {
    constructor(tittel, fraDato, tilDato, kolonne) {
        this.tittel = tittel;
        this.fraDato = fraDato;
        this.tilDato = tilDato;
        this.kolonne = kolonne;
        this.tilstand = AktivitetTilstand.INGEN;
        this.aktivitetURL = '';
    }

    get fraDatoMedPunktum() {
        return toDatePrettyPrint(this.fraDato);
    }

    get tilDatoMedPunktum() {
        return toDatePrettyPrint(this.tilDato);
    }

    get fraDatoMedMnd() {
        return getRelativeDatePrettyPrint(this.fraDato);
    }

    get tilDatoMedMnd() {
        return getRelativeDatePrettyPrint(this.tilDato);
    }

    get url() {
        return aktivitetURL;
    }
}

export class StillingsAktivitet extends AktivitetData {
    constructor(tittel, fraDato, tilDato) {
        super(tittel, fraDato, tilDato, AktivitetStatus.PLANLEGGER);
        this.lenke = '';
        this.beskrivelse = '';
        this.arbeidssted = '';
        this.arbeidsgiver = '';
        this.kontaktperson = '';
    }
    get type() {
        return AktivitetsType.STILLING;
    }

    get aktivitetskortDato() {
        return this.fraDatoMedMnd + ' - ' + this.tilDatoMedMnd;
    }

    oppgiValgfrieFelter(
        lenke,
        beskrivelse,
        arbeidssted,
        arbeidsgiver,
        kontaktperson
    ) {
        this.lenke = lenke;
        this.beskrivelse = beskrivelse;
        this.arbeidssted = arbeidssted;
        this.arbeidsgiver = arbeidsgiver;
        this.kontaktperson = kontaktperson;
    }
}

export class JobbrettetAktivitet extends AktivitetData {
    constructor(tittel, fraDato, tilDato) {
        super(tittel, fraDato, tilDato, AktivitetStatus.FORSLAG);
        this.lenke = '';
        this.hensikt = '';
        this.beskrivelse = '';
        this.huskeliste = '';
    }
    get type() {
        return AktivitetsType.EGENAKTIVITET;
    }

    get aktivitetskortDato() {
        return this.fraDatoMedMnd + ' - ' + this.tilDatoMedMnd;
    }

    oppgiValgfrieFelter(lenke, hensikt, beskrivelse, huskeliste) {
        this.lenke = lenke;
        this.hensikt = hensikt;
        this.beskrivelse = beskrivelse;
        this.huskeliste = huskeliste;
    }
}

export class MoteMedNavAktivitet extends AktivitetData {
    constructor(
        tittel,
        dato,
        klokkeslett,
        varighet,
        moteform,
        motested,
        forberedelser
    ) {
        super(tittel, dato, '', AktivitetStatus.PLANLEGGER);
        this.klokkeslett = klokkeslett;
        this.varighet = varighet;
        this.moteform = moteform;
        this.motested = motested;
        this.hensikt =
            'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';
        this.forberedelser = forberedelser;
    }

    get type() {
        return AktivitetsType.MOTE;
    }
    get aktivitetskortDato() {
        return this.fraDatoMedMnd;
    }
}

export class SokeJobberAktivitet extends AktivitetData {
    constructor(
        fraDato,
        tilDato,
        antallSoknader,
        oppfolgingFraNav,
        beskrivelse
    ) {
        super(
            'Avtale om å søke jobber',
            fraDato,
            tilDato,
            AktivitetStatus.PLANLEGGER
        );
        this.antallSoknader = antallSoknader;
        this.oppfolgingFraNav = oppfolgingFraNav;
        this.beskrivelse = beskrivelse;
    }

    get type() {
        return AktivitetsType.AVTALE;
    }

    get aktivitetskortDato() {
        return this.fraDatoMedMnd + ' - ' + this.tilDatoMedMnd;
    }
}

export class MedisinskBehandlingAktivitet extends AktivitetData {
    constructor(
        behandlingsType,
        behandlingsSted,
        fraDato,
        tilDato,
        mal,
        beskrivelse,
        oppfolgingFraNav
    ) {
        super(
            'Medisinsk behandling',
            fraDato,
            tilDato,
            AktivitetStatus.PLANLEGGER
        );
        this.behandlingsType = behandlingsType;
        this.behandlingsSted = behandlingsSted;
        this.mal = mal;
        this.oppfolgingFraNav = oppfolgingFraNav;
        this.beskrivelse = beskrivelse;
    }

    get type() {
        return AktivitetsType.MEDISINSKBEHANDLING;
    }

    get aktivitetskortDato() {
        return this.fraDatoMedMnd + ' - ' + this.tilDatoMedMnd;
    }
}

export class ArenaAktivitet extends AktivitetData {
    constructor(tittel, fraDato, tilDato, beskrivelse, status, avtalt, arrangoer, antallDagerPerUke, deltakelseProsent){
        super(tittel, fraDato, tilDato, status);
        this.beskrivelse = beskrivelse;
        this.avtalt = avtalt;
        this.arrangoer = arrangoer;
        this.antallDagerPerUke = antallDagerPerUke;
        this.deltakelseProsent = `${deltakelseProsent}%`;
    }

    get type() {
        return AktivitetsType.ARENA;
    }

    get aktivitetskortDato() {
        return this.fraDatoMedMnd + ' - ' + this.tilDatoMedMnd;
    }

}
