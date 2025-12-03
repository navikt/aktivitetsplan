import { AvtaltFilterType, EtikettFilterType } from '../filtrering/filter/FilterVisning';
import { ArenaEtikett } from '../../datatypes/arenaAktivitetTypes';
import { AlleAktivitetTyper } from '../../utils/textMappers';
import { FilterState } from '../filtrering/filter/filter-slice';

export interface ArkivFilter {
    inkluderHistorikk: boolean;
    inkluderAktiviteterIKvpPeriode: boolean;
    aktivitetAvtaltMedNavFilter: AvtaltFilterType[];
    stillingsstatusFilter: EtikettFilterType[];
    arenaAktivitetStatusFilter: ArenaEtikett[];
    aktivitetTypeFilter: AlleAktivitetTyper[];
}

export const defaultFilter: ArkivFilter = {
        inkluderHistorikk: false,
        inkluderAktiviteterIKvpPeriode: false,
        aktivitetAvtaltMedNavFilter: [],
        stillingsstatusFilter: [],
        arenaAktivitetStatusFilter: [],
        aktivitetTypeFilter: [],
};

export const mapTilJournalforingFilter = (filter: FilterState, inkluderHistorikk: boolean, inkluderAktiviteterIKvpPeriode: boolean): ArkivFilter => {
    return {
        inkluderHistorikk: inkluderHistorikk,
        inkluderAktiviteterIKvpPeriode: inkluderAktiviteterIKvpPeriode,
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
        arenaAktivitetStatusFilter: [],
        aktivitetTypeFilter: []
    };
};
