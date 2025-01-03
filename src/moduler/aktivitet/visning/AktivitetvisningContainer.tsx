import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { Status } from '../../../createGenericSlice';
import { isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../Provider';
import { RootState } from '../../../store';
import { DirtyProvider } from '../../context/dirty-context';
import { selectOppfolgingStatus } from '../../oppfolging-status/oppfolging-selector';
import { prefixAktivtetskortId } from '../aktivitet-kort/Aktivitetskort';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { kanEndreAktivitetDetaljer, selectAktivitetMedId } from '../aktivitetlisteSelector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import Aktivitetvisning from './Aktivitetvisning';
import AktivitetvisningModal from './AktivitetvisningModal';
import { createSelector } from '@reduxjs/toolkit';

const selectAvhengigheter = createSelector(
    selectOppfolgingStatus,
    selectAktivitetStatus,
    (oppfolginsStatus, aktiviteterStatus) => {
        return [
            oppfolginsStatus,
            // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
            // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
            // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
            aktiviteterStatus,
        ];
    },
);

const AktivitetvisningContainer = () => {
    const { id } = useParams<{ id: string }>();
    const aktivitetId = id;

    const erVeileder = useErVeileder();
    const valgtAktivitet = useSelector((state: RootState) =>
        aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined,
    );

    const aktivitetDataStatus = useSelector((state: RootState) => {
        return valgtAktivitet
            ? isArenaAktivitet(valgtAktivitet)
                ? selectArenaAktivitetStatus(state)
                : selectAktivitetStatus(state)
            : Status.NOT_STARTED;
    });

    const laster = aktivitetDataStatus !== Status.OK;
    const avhengigheter = useSelector(selectAvhengigheter);
    const tillatEndring = kanEndreAktivitetDetaljer(valgtAktivitet as VeilarbAktivitet, erVeileder);

    useEffect(() => {
        return () => {
            const aktivitetskort =
                valgtAktivitet && document.querySelector(`#${prefixAktivtetskortId(valgtAktivitet)}`);
            if (aktivitetskort) {
                (aktivitetskort as HTMLDivElement)?.focus();
            }
        };
    }, []);

    return (
        <DirtyProvider>
            <AktivitetvisningModal aktivitet={valgtAktivitet} avhengigheter={avhengigheter}>
                {valgtAktivitet ? (
                    <Aktivitetvisning aktivitet={valgtAktivitet} tillatEndring={tillatEndring} laster={laster} />
                ) : (
                    <Navigate replace to={'/'} />
                )}
            </AktivitetvisningModal>
        </DirtyProvider>
    );
};

export default AktivitetvisningContainer;
