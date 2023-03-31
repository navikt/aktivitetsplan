import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import { isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../Provider';
import { DirtyProvider } from '../../context/dirty-context';
import { selectErUnderOppfolging, selectOppfolgingStatus } from '../../oppfolging-status/oppfolging-selector';
import { hentAktivitet } from '../aktivitet-actions';
import { prefixAktivtetskortId } from '../aktivitet-kort/Aktivitetskort';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { kanEndreAktivitetDetaljer, selectAktivitetMedId } from '../aktivitetlisteSelector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../arena-aktiviteter-reducer';
import Aktivitetvisning from './Aktivitetvisning';
import AktivitetvisningModal from './AktivitetvisningModal';

const AktivitetvisningContainer = () => {
    const { id } = useParams<{ id: string }>();
    const aktivitetId = id;

    const dispatch = useDispatch();

    const erVeileder = useErVeileder();
    const valgtAktivitet = useSelector((state) => (aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined));

    const arenaDataStatus = useSelector(selectArenaAktivitetStatus);
    const aktivitetDataStatus = useSelector(selectAktivitetStatus);

    const laster = arenaDataStatus !== STATUS.OK || aktivitetDataStatus !== STATUS.OK;

    const avhengigheter = useSelector((state) => [
        selectOppfolgingStatus(state),
        // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
        // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
        // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
        aktivitetDataStatus,
    ]);

    const tillatEndring = kanEndreAktivitetDetaljer(valgtAktivitet as VeilarbAktivitet, erVeileder);
    const underOppfolging = useSelector(selectErUnderOppfolging);

    useEffect(() => {
        if (valgtAktivitet) {
            if (isArenaAktivitet(valgtAktivitet)) {
                dispatch(hentArenaAktiviteter() as unknown as AnyAction);
            } else {
                dispatch(hentAktivitet(valgtAktivitet.id + '') as unknown as AnyAction);
            }
        }

        return () => {
            const aktivitetskort =
                valgtAktivitet && document.querySelector(`#${prefixAktivtetskortId(valgtAktivitet)}`);
            if (aktivitetskort) {
                (aktivitetskort as HTMLDivElement).focus();
            }
        };
        // todo fix
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DirtyProvider>
            <AktivitetvisningModal aktivitet={valgtAktivitet} avhengigheter={avhengigheter}>
                {valgtAktivitet ? (
                    <Aktivitetvisning
                        aktivitet={valgtAktivitet}
                        tillatEndring={tillatEndring}
                        underOppfolging={underOppfolging}
                        laster={laster}
                    />
                ) : (
                    <Navigate replace to={'/'} />
                )}
            </AktivitetvisningModal>
        </DirtyProvider>
    );
};

export default AktivitetvisningContainer;
