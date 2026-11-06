import { describe, expect, it } from 'vitest';
import aktivitetReducer, {
    aktivitetAdapter,
    AktivitetMedHistorikk,
    AktivitetState,
    getOrCreatePeriode,
    oppfolgingsdperiodeAdapter,
    PeriodeEntityState,
} from './aktivitet-slice';
import { hentAktivitet, hentAktivitetHistorikk, lagNyAktivitet, oppdaterReferat } from './aktivitet-actions';
import { AktivitetsId, OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';
import {
    MotedeltakerRolle,
    SamtalereferatAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../../datatypes/internAktivitetTypes';
import { AktivitetStatus, Kanal } from '../../datatypes/aktivitetTypes';
import { Historikk } from '../../datatypes/Historikk';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';
import { EntityState, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '../../store/createGenericSlice';
import { GraphqlResponse } from '../../api/graphql/graphqlResult';
import { enMoteAktivitet } from '../../mocks/fixtures/moteAktivitetFixtures';

const periodeId = 'periode-1' as OppfolgingsPeriodeId;
const aktivitetId = 'aktivitet-1' as AktivitetsId;

const historikk: Historikk = {
    endringer: [
        {
            endretAvType: 'VEILEDER',
            endretAv: 'Z123456',
            tidspunkt: '2024-01-01T10:00:00',
            beskrivelseForVeileder: 'Opprettet',
            beskrivelseForBruker: 'Opprettet',
            versjonsId: '1' as any,
        },
    ],
};

const baseAktivitet: SamtalereferatAktivitet & { historikk: Historikk } = {
    id: aktivitetId,
    type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
    tittel: 'Samtalereferat',
    status: AktivitetStatus.GJENNOMFOERT,
    oppfolgingsperiodeId: periodeId,
    fraDato: '2024-01-01',
    kanal: Kanal.OPPMOTE,
    referat: 'Opprinnelig referat',
    erReferatPublisert: false,
    opprettetDato: '2024-01-01T10:00:00',
    endretDato: '2024-01-01T10:00:00',
    endretAv: 'Z123456',
    endretAvType: 'NAV',
    avtalt: false,
    versjon: '1' as any,
    historisk: false,
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    historikk,
};

function buildStateWithAktivitet(aktivitet: AktivitetMedHistorikk): AktivitetState {
    const periodeState = getOrCreatePeriode(
        oppfolgingsdperiodeAdapter.getInitialState({ status: Status.OK }),
        periodeId,
    );
    const aktiviteter = aktivitetAdapter.upsertOne(periodeState.aktiviteter, aktivitet);
    return oppfolgingsdperiodeAdapter.upsertOne(oppfolgingsdperiodeAdapter.getInitialState({ status: Status.OK }), {
        id: periodeId,
        aktiviteter,
        start: '2024-01-01',
        slutt: undefined,
    });
}

const getAktivitetAfterUpdate = (
    state: EntityState<PeriodeEntityState, OppfolgingsPeriodeId> & { status: Status },
    action: PayloadAction<
        | VeilarbAktivitet
        | GraphqlResponse<{
              aktivitet: {
                  historikk: Historikk;
                  id: AktivitetsId;
              };
          }>
    >,
) => {
    const newState = aktivitetReducer(state, action);
    const periode = newState.entities[periodeId];
    const aktivitetEtterOppdatering = periode?.aktiviteter.entities[aktivitetId];
    return aktivitetEtterOppdatering;
};

describe('aktivitet-slice', () => {
    it('bevarer deltakere i state når en møteaktivitet opprettes', () => {
        const aktivitet = enMoteAktivitet({
            id: aktivitetId,
            oppfolgingsperiodeId: periodeId,
            motedeltakere: [
                { navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] },
                { navn: 'Test Deltaker', roller: [MotedeltakerRolle.ARBEIDSGIVER, MotedeltakerRolle.MENTOR_FADDER] },
            ],
        });
        const state = aktivitetReducer(
            undefined,
            lagNyAktivitet.fulfilled(aktivitet, 'request-id', {
                aktivitet,
                oppfolgingsPeriodeId: periodeId,
            }),
        );
        const lagretAktivitet = state.entities[periodeId]?.aktiviteter.entities[aktivitetId];

        expect(lagretAktivitet?.type).toBe(VeilarbAktivitetType.MOTE_TYPE);
        if (lagretAktivitet?.type !== VeilarbAktivitetType.MOTE_TYPE) {
            throw new Error('Forventet en møteaktivitet i state');
        }
        expect(lagretAktivitet.motedeltakere).toEqual(aktivitet.motedeltakere);
    });

    describe('oppdaterReferat.fulfilled', () => {
        it('skal ikke overskrive historikk med null hvis response inneholder historikk: null', () => {
            const stateWithHistorikk = buildStateWithAktivitet(baseAktivitet);
            const oppdatertAktivitetFraServer: SamtalereferatAktivitet & { historikk: null } = {
                ...baseAktivitet,
                referat: 'Oppdatert referat',
                historikk: null,
            };
            const action = oppdaterReferat.fulfilled(oppdatertAktivitetFraServer, '', undefined as any);

            const aktivitetEtterOppdatering = getAktivitetAfterUpdate(
                stateWithHistorikk,
                action,
            ) as SamtalereferatAktivitet & {
                historikk: Historikk;
            };

            expect(aktivitetEtterOppdatering.historikk).toEqual(historikk);
            expect(aktivitetEtterOppdatering.referat).toBe('Oppdatert referat');
        });

        it('skal ikke oveskrive historikk med undefined når response ikke har feltet historikk', () => {
            const stateWithHistorikk = buildStateWithAktivitet(baseAktivitet);
            const { historikk: _removed, ...aktivitetUtenHistorikk } = baseAktivitet;
            const oppdatertAktivitetFraServer = {
                ...aktivitetUtenHistorikk,
                referat: 'Oppdatert referat',
            } as SamtalereferatAktivitet;

            const aktivitetEtterOppdatering = getAktivitetAfterUpdate(
                stateWithHistorikk,
                oppdaterReferat.fulfilled(oppdatertAktivitetFraServer, '', undefined as any),
            ) as SamtalereferatAktivitet & {
                historikk: Historikk;
            };

            expect(aktivitetEtterOppdatering.historikk).toEqual(historikk);
            expect(aktivitetEtterOppdatering.referat).toBe('Oppdatert referat');
        });
    });

    describe('hentAktivitet.fulfilled', () => {
        it('skal sette historikk i state', () => {
            const { historikk: _, ...baseUtenHistorikk } = baseAktivitet;
            const stateWithoutHistorikk = buildStateWithAktivitet(baseUtenHistorikk);
            expect(
                stateWithoutHistorikk.entities[periodeId].aktiviteter.entities[aktivitetId].historikk,
            ).toBeUndefined();
            const oppdatertAktivitetFraServer: GraphqlResponse<{
                aktivitet: SamtalereferatAktivitet & { historikk: Historikk };
                eier: { fnr: string };
            }> = {
                data: {
                    aktivitet: {
                        ...baseUtenHistorikk,
                        historikk: historikk,
                    },
                    eier: { fnr: 'mitt nr' },
                },
            };
            const action = hentAktivitet.fulfilled(oppdatertAktivitetFraServer, '', undefined as any);

            const aktivitetEtterOppdatering = getAktivitetAfterUpdate(
                stateWithoutHistorikk,
                action,
            ) as SamtalereferatAktivitet & {
                historikk: Historikk;
            };

            expect(aktivitetEtterOppdatering.historikk).toEqual(historikk);
        });
    });

    describe('hentAktivitetHistorikk.fulfilled', () => {
        it('skal sette historikk i state', () => {
            const { historikk, ...baseUtenHistorikk } = baseAktivitet;
            const stateWithoutHistorikk = buildStateWithAktivitet(baseUtenHistorikk);
            expect(
                stateWithoutHistorikk.entities[periodeId].aktiviteter.entities[aktivitetId].historikk,
            ).toBeUndefined();
            const oppdatertAktivitetFraServer: GraphqlResponse<{
                aktivitet: {
                    historikk: Historikk;
                    id: AktivitetsId;
                };
            }> = {
                data: {
                    aktivitet: {
                        historikk,
                        id: aktivitetId,
                    },
                },
                errors: undefined,
            };
            const action = hentAktivitetHistorikk.fulfilled(oppdatertAktivitetFraServer, '', undefined as any);

            const aktivitetEtterOppdatering = getAktivitetAfterUpdate(
                stateWithoutHistorikk,
                action,
            ) as SamtalereferatAktivitet & {
                historikk: Historikk;
            };

            expect(aktivitetEtterOppdatering.historikk).toEqual(historikk);
        });
    });
});
