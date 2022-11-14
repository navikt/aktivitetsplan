import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { STATUS } from '../../../api/utils';
import { isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { DirtyProvider } from '../../context/dirty-context';
import { selectErUnderOppfolging, selectOppfolgingStatus } from '../../oppfolging-status/oppfolging-selector';
import { hentAktivitet } from '../aktivitet-actions';
import { prefixAktivtetskortId } from '../aktivitet-kort/Aktivitetskort';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { selectAktivitetMedId, selectKanEndreAktivitetDetaljer } from '../aktivitetlisteSelector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../arena-aktiviteter-reducer';
import Aktivitetvisning from './Aktivitetvisning';
import { AktivitetvisningIkkeFunnet } from './AktivitetvisningIkkeFunnet';
import AktivitetvisningModal from './AktivitetvisningModal';

interface AktivitetvisningContainerProps {
    match: any;
}

const AktivitetvisningContainer = (props: AktivitetvisningContainerProps) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, Action>>();
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const avhengigheter = useSelector((state) => [
        selectOppfolgingStatus(state),
        // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
        // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
        // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
        aktivitetDataStatus,
    ]);

    const erArenaAktivitet = aktivitetId.startsWith('ARENA');
    const aktivitetDataStatus = useSelector((state) =>
        erArenaAktivitet ? selectArenaAktivitetStatus(state) : selectAktivitetStatus(state)
    );
    const laster = aktivitetDataStatus !== STATUS.OK;
    const underOppfolging = useSelector(selectErUnderOppfolging);

    const tillatEndring = useSelector((state) =>
        selectKanEndreAktivitetDetaljer(state, valgtAktivitet as VeilarbAktivitet)
    );

    function notEmpty<AlleAktiviteter>(value: AlleAktiviteter | null | undefined): value is AlleAktiviteter {
        return value !== null && value !== undefined;
    }

    useEffect(() => {
        if ([valgtAktivitet].filter(notEmpty).some(isArenaAktivitet)) dispatch(hentArenaAktiviteter());
        else dispatch(hentAktivitet(valgtAktivitet?.id + ''));
        return (document.querySelector(`#${prefixAktivtetskortId(valgtAktivitet)}`) as HTMLDivElement)?.focus;
    }, [valgtAktivitet, dispatch]);

    return (
        <DirtyProvider>
            <AktivitetvisningModal aktivitet={valgtAktivitet} avhengigheter={avhengigheter} {...props}>
                {valgtAktivitet ? (
                    <Aktivitetvisning
                        aktivitet={valgtAktivitet}
                        {...props}
                        tillatEndring={tillatEndring}
                        underOppfolging={underOppfolging}
                        laster={laster}
                    />
                ) : (
                    <AktivitetvisningIkkeFunnet />
                )}
            </AktivitetvisningModal>
        </DirtyProvider>
    );
};

export default AktivitetvisningContainer;
