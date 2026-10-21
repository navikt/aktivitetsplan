import { MinimalPeriode } from '../../moduler/oppfolging-status/oppfolging-selector';
import { OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { mockTestAktiviteter } from '../../mocks/aktivitet';
import { OppfolgingsPeriode } from '../../api/veilarboppfolging';
import {
    aktivitetAdapter,
    getOrCreatePeriode,
    oppfolgingsdperiodeAdapter,
} from '../../moduler/aktivitet/aktivitet-slice';
import { Status } from '../../store/createGenericSlice';

const aktivitetTittel = 'Videresend aktivitet';
const periode: MinimalPeriode = {
    id: '1' as OppfolgingsPeriodeId,
    start: new Date().toISOString(),
    slutt: undefined,
};
const aktivitet: VeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: aktivitetTittel,
    oppfolgingsperiodeId: periode.id,
};

const toMinimalPeriode = (
    periode: MinimalPeriode | (OppfolgingsPeriode & { startTidspunkt: string }),
): MinimalPeriode => {
    if ('sluttTidspunkt' in periode) {
        return {
            id: periode.id,
            start: periode.startTidspunkt,
            slutt: periode.sluttTidspunkt,
        };
    } else {
        return periode;
    }
};

export const aktiviteterState = ({
    aktiviteter,
    oppfolgingsPerioder,
    status,
}: {
    aktiviteter?: VeilarbAktivitet[];
    oppfolgingsPerioder: (MinimalPeriode | (OppfolgingsPeriode & { startTidspunkt: string }))[];
    status?: Status;
}) => {
    const state = oppfolgingsdperiodeAdapter.getInitialState({ status: status || Status.OK });
    if (oppfolgingsPerioder.length == 0 && (aktiviteter || []).length != 0)
        throw new Error('Feil i test-mock oppsett: Kan ikke ha aktiviteter uten å ha oppfølgingsperioder');
    const minimalePerioder = (oppfolgingsPerioder || []).map(toMinimalPeriode);
    const oppfolgingsperioder = minimalePerioder.map((periode) => {
        const periodeState = getOrCreatePeriode(state, periode.id);
        return {
            id: periode.id,
            aktiviteter: aktivitetAdapter.upsertMany(
                periodeState.aktiviteter,
                (aktiviteter || []).filter((aktivitet) => aktivitet.oppfolgingsperiodeId === periode.id),
            ),
            start: periode.start,
            slutt: periode.slutt,
        };
    });
    return oppfolgingsdperiodeAdapter.upsertMany(state, oppfolgingsperioder);
};

export const stateMedAktiviteter = aktiviteterState({ aktiviteter: [aktivitet], oppfolgingsPerioder: [periode] });
