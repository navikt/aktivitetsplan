import { AvtaltFilterType, EtikettFilterType } from '../filtrering/filter/FilterVisning';
import { ArenaEtikett } from '../../datatypes/arenaAktivitetTypes';
import { AlleAktivitetTyper } from '../../utils/textMappers';
import { FilterState } from '../filtrering/filter/filter-slice';

export interface ArkivFilter {
    inkluderHistorikk: boolean;
    inkluderAktiviteterIKvpPeriode: boolean;
    inkluderDialoger: true;
    kvpUtvalgskriterie: {
        alternativ: KvpUtvalgskriterieAlternativ,
        start?: string,
        slutt?: string,
    }
    aktivitetAvtaltMedNavFilter: AvtaltFilterType[];
    stillingsstatusFilter: EtikettFilterType[];
    arenaAktivitetStatusFilter: ArenaEtikett[];
    aktivitetTypeFilter: AlleAktivitetTyper[];
}

enum KvpUtvalgskriterieAlternativ {
    EKSKLUDER_KVP_AKTIVITETER = "EKSKLUDER_KVP_AKTIVITETER",
    INKLUDER_KVP_AKTIVITETER = "INKLUDER_KVP_AKTIVITETER",
    KUN_KVP_AKTIVITETER = "KUN_KVP_AKTIVITETER"
}

export const defaultFilter: ArkivFilter = {
        inkluderHistorikk: false,
        inkluderAktiviteterIKvpPeriode: false,
        inkluderDialoger: true,
        kvpUtvalgskriterie: {
            alternativ: KvpUtvalgskriterieAlternativ.EKSKLUDER_KVP_AKTIVITETER,
        },
        aktivitetAvtaltMedNavFilter: [],
        stillingsstatusFilter: [],
        arenaAktivitetStatusFilter: [],
        aktivitetTypeFilter: [],
};
export const mapTilJournalforingFilter = (filter: FilterState, inkluderHistorikk: boolean, inkluderAktiviteterIKvpPeriode: boolean): ArkivFilter => {
    return {
        inkluderHistorikk: inkluderHistorikk,
        inkluderAktiviteterIKvpPeriode: inkluderAktiviteterIKvpPeriode,
        inkluderDialoger: true,
        kvpUtvalgskriterie: {
            alternativ: KvpUtvalgskriterieAlternativ.EKSKLUDER_KVP_AKTIVITETER,
        },
        aktivitetAvtaltMedNavFilter: [
            filter.aktivitetAvtaltMedNav.AVTALT_MED_NAV && 'AVTALT_MED_NAV',
            filter.aktivitetAvtaltMedNav.IKKE_AVTALT_MED_NAV && 'IKKE_AVTALT_MED_NAV',
        ].filter(Boolean) as unknown as AvtaltFilterType[],
        stillingsstatusFilter: [
            filter.aktivitetEtiketter.AVSLAG && 'AVSLAG',
            filter.aktivitetEtiketter.CV_DELT && 'CV_DELT',
            filter.aktivitetEtiketter.IKKE_FATT_JOBBEN && 'IKKE_FATT_JOBBEN',
            filter.aktivitetEtiketter.INGEN_VALGT && 'INGEN_VALGT',
            filter.aktivitetEtiketter.INNKALT_TIL_INTERVJU && 'INNKALT_TIL_INTERVJU',
            filter.aktivitetEtiketter.JOBBTILBUD && 'JOBBTILBUD',
            filter.aktivitetEtiketter.SKAL_PAA_INTERVJU && 'SKAL_PAA_INTERVJU',
            filter.aktivitetEtiketter.SOKNAD_SENDT && 'SOKNAD_SENDT',
            filter.aktivitetEtiketter.VENTER && 'VENTER',
            filter.aktivitetEtiketter.FATT_JOBBEN && 'FATT_JOBBEN',
        ].filter(Boolean) as unknown as EtikettFilterType[],
        arenaAktivitetStatusFilter: [
            filter.arenaAktivitetEtiketter.AKTUELL && 'AKTUELL',
            filter.arenaAktivitetEtiketter.AVSLAG && 'AVSLAG',
            filter.arenaAktivitetEtiketter.IKKAKTUELL && 'IKKAKTUELL',
            filter.arenaAktivitetEtiketter.IKKEM && 'IKKEM',
            filter.arenaAktivitetEtiketter.INFOMOETE && 'INFOMOETE',
            filter.arenaAktivitetEtiketter.JATAKK && 'JATAKK',
            filter.arenaAktivitetEtiketter.NEITAKK && 'NEITAKK',
            filter.arenaAktivitetEtiketter.TILBUD && 'TILBUD',
            filter.arenaAktivitetEtiketter.VENTELISTE && 'VENTELISTE',
        ].filter(Boolean) as unknown as ArenaEtikett[
        ],
        aktivitetTypeFilter: [
            filter.aktivitetTyper.STILLING && 'STILLING',
            filter.aktivitetTyper.TILTAKSAKTIVITET && 'TILTAKSAKTIVITET',
            filter.aktivitetTyper.GRUPPEAKTIVITET && 'GRUPPEAKTIVITET',
            filter.aktivitetTyper.UTDANNINGSAKTIVITET && 'UTDANNINGSAKTIVITET',
            filter.aktivitetTyper.SOKEAVTALE && 'SOKEAVTALE',
            filter.aktivitetTyper.IJOBB && 'IJOBB',
            filter.aktivitetTyper.BEHANDLING && 'BEHANDLING',
            filter.aktivitetTyper.MOTE && 'MOTE',
            filter.aktivitetTyper.SAMTALEREFERAT && 'SAMTALEREFERAT',
            filter.aktivitetTyper.STILLING_FRA_NAV && 'STILLING_FRA_NAV',
            filter.aktivitetTyper.ARENA_TILTAK && 'ARENA_TILTAK',
            filter.aktivitetTyper.MIDLERTIDIG_LONNSTILSKUDD && 'MIDLERTIDIG_LONNSTILSKUDD',
            filter.aktivitetTyper.VARIG_LONNSTILSKUDD && 'VARIG_LONNSTILSKUDD',
            filter.aktivitetTyper.ARBEIDSTRENING && 'ARBEIDSTRENING',
            filter.aktivitetTyper.VARIG_TILRETTELAGT_ARBEID_I_ORDINAER_VIRKSOMHET && 'VARIG_TILRETTELAGT_ARBEID_I_ORDINAER_VIRKSOMHET',
            filter.aktivitetTyper.MENTOR && 'MENTOR',
            filter.aktivitetTyper.REKRUTTERINGSTREFF && 'REKRUTTERINGSTREFF',
            filter.aktivitetTyper.ENKELAMO && 'ENKELAMO',
            filter.aktivitetTyper.ENKFAGYRKE && 'ENKFAGYRKE',
            filter.aktivitetTyper.HOYEREUTD && 'HOYEREUTD'
        ].filter(Boolean) as unknown as AlleAktivitetTyper[],
    };
};
