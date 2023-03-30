import { brukertype } from './types';

export interface Dialog {
    id: string;
    overskrift: string;
    aktivitetId?: string;
    lest?: boolean;
    sisteDato: string;
    sisteTekst?: string;
    erLestAvBruker?: boolean;
    venterPaSvar?: boolean;
    ferdigBehandlet?: boolean;
    opprettetDato: string;
    henvendelser?: Henvendelse[];
    egenskaper?: string[];
}

export interface Henvendelse {
    id: string;
    dialogId: string;
    tekst: string;
    avsender: brukertype;
    avsenderId?: string;
    sendt: string;
    lest: boolean;
}

type DialogEgenskap = 'ESKALERINGSVARSEL' | 'PARAGRAF8';

export interface NyHenvendelse {
    tekst: string;
    dialogId: string;
    overskrift: string;
    aktivitetId: string;
    egenskaper: DialogEgenskap[];
}

export interface SistOppdatert {
    sistOppdatert: number;
}

export interface Eskaleringsvarsel {
    id: string;
    tilhorendeDialogId: string;
    opprettetAv: string;
    opprettetDato: string;
    opprettetBegrunnelse: string;
}
