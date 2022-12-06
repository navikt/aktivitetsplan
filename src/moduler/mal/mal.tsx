import './mal.less';

import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from 'redux';

import { CONFIRM } from '../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectHarSkriveTilgang, selectUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { hentMal, selectMalStatus } from './aktivitetsmal-reducer';
import { selectMalListeStatus } from './aktivitetsmal-selector';
import MalContainer from './mal-container';
import MalHistorikk from './mal-historikk';
import { MalModal } from './mal-modal';
import { hentMalListe } from './malliste-reducer';

function Mal() {
    const malStatus = useSelector(selectMalStatus, shallowEqual);
    const malListeStatus = useSelector(selectMalListeStatus, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const underOppfolging = useSelector(selectUnderOppfolging, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const isDirty = useRef(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(hentMal() as unknown as AnyAction);
        dispatch(hentMalListe() as unknown as AnyAction);
    }, [dispatch]);

    const avhengigheter = [malStatus, malListeStatus];

    const onModalRequestClosed = () => {
        if (isDirty.current) {
            if (window.confirm(CONFIRM)) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    return (
        <MalModal onRequestClosed={onModalRequestClosed}>
            <Innholdstittel className="aktivitetmal__header">
                {viserHistoriskPeriode || !underOppfolging || !harSkriveTilgang
                    ? 'Ditt mål fra en tidligere periode'
                    : 'Ditt mål'}
            </Innholdstittel>
            <Undertekst className="aktivitetmal__sub-header" tag="div">
                Skriv noen ord om hva som er målet ditt slik at vi kan veilede deg bedre.
                <ul>
                    <li>Hva er målet på kort sikt? Hva er målet på lengre sikt?</li>
                    <li>Hva slags arbeidsoppgaver ønsker du deg?</li>
                </ul>
            </Undertekst>
            <Innholdslaster avhengigheter={avhengigheter} alleOK>
                <section className="aktivitetmal">
                    <MalContainer dirtyRef={isDirty} />
                    <MalHistorikk />
                </section>
            </Innholdslaster>
        </MalModal>
    );
}

export default Mal;
