import { Heading, ReadMore } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { CONFIRM } from '../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectHarSkriveTilgang, selectUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectMalStatus } from './aktivitetsmal-selector';
import { hentMal } from './aktivitetsmal-slice';
import MalContainer from './mal-container';
import MalHistorikk from './mal-historikk';
import { MalModal } from './mal-modal';
import { selectMalListe, selectMalListeStatus } from './malliste-selector';
import { hentMalListe } from './malliste-slice';

const Mal = () => {
    const malStatus = useSelector(selectMalStatus, shallowEqual);
    const malListeStatus = useSelector(selectMalListeStatus, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const underOppfolging = useSelector(selectUnderOppfolging, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);
    const historiskeMal = useSelector(selectMalListe, shallowEqual);

    const isDirty = useRef(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(hentMal());
        dispatch(hentMalListe());
    }, []);

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
            <div>
                <Heading level="1" size="large" className="mb-8">
                    {viserHistoriskPeriode || !underOppfolging || !harSkriveTilgang
                        ? 'Mitt mål fra en tidligere periode'
                        : 'Mitt mål'}
                </Heading>
                <ReadMore className="mb-8" header="Tips til mål" defaultOpen={historiskeMal.length === 0}>
                    Skriv noen ord om hva som er målet ditt slik at vi kan veilede deg bedre.
                    <ul className="list-disc mt-4 pl-8">
                        <li>Hva er målet på kort sikt? Hva er målet på lengre sikt?</li>
                        <li>Hva slags arbeidsoppgaver ønsker du deg?</li>
                    </ul>
                </ReadMore>
                <Innholdslaster className="flex m-auto" avhengigheter={avhengigheter} alleOK>
                    <section>
                        <MalContainer dirtyRef={isDirty} />
                        <MalHistorikk />
                    </section>
                </Innholdslaster>
            </div>
        </MalModal>
    );
};

export default Mal;
