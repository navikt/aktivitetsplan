import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { STATUS } from '../../../api/utils';
import { isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { useReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
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

type Props = RouteComponentProps<{ id: string }>;

const AktivitetvisningContainer = (props: Props) => {
    const erVeileder = useErVeileder();
    const dispatch = useReduxDispatch();
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const tillatEndring = valgtAktivitet ? kanEndreAktivitetDetaljer(valgtAktivitet, erVeileder) : false;
    const underOppfolging = useSelector((state) => selectErUnderOppfolging(state));
    const aktivitetDataStatus = useSelector((state) => selectAktivitetStatus(state));
    const arenaDataStatus = useSelector((state) => selectArenaAktivitetStatus(state));
    const laster = arenaDataStatus !== STATUS.OK || aktivitetDataStatus !== STATUS.OK;

    const oppfolgingsStatus = useSelector((state) => selectOppfolgingStatus(state));
    const avhengigheter = [
        oppfolgingsStatus,
        // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
        // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
        // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
        aktivitetDataStatus,
    ];

    useEffect(() => {
        if (valgtAktivitet) {
            if (isArenaAktivitet(valgtAktivitet)) {
                dispatch(hentArenaAktiviteter());
            } else {
                dispatch(hentAktivitet(valgtAktivitet.id));
            }
        }
        return () => {
            const aktivitetskort =
                valgtAktivitet && document.querySelector(`#${prefixAktivtetskortId(valgtAktivitet)}`);
            if (aktivitetskort) {
                aktivitetskort.focus();
            }
        };
    }, []);

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
                    <Redirect to={'/'} />
                )}
            </AktivitetvisningModal>
        </DirtyProvider>
    );
};

export default AktivitetvisningContainer;
