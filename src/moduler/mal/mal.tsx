import { ReadMore } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CONFIRM } from '../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { useRoutes } from '../../routing/useRoutes';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectMalStatus } from './aktivitetsmal-selector';
import MalContainer from './mal-container';
import MalHistorikk from './mal-historikk';
import { MalModal } from './mal-modal';
import { selectMalListe, selectMalListeStatus } from './malliste-selector';

const Mal = () => {
    const malStatus = useSelector(selectMalStatus, shallowEqual);
    const malListeStatus = useSelector(selectMalListeStatus, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);
    const historiskeMal = useSelector(selectMalListe, shallowEqual);

    const isDirty = useRef(false);

    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();

    const avhengigheter = [malStatus, malListeStatus];

    const onModalRequestClosed = () => {
        if (!isDirty.current || window.confirm(CONFIRM)) {
            navigate(hovedsideRoute());
            return true;
        }
        return false;
    };

    return (
        <MalModal
            onRequestClosed={onModalRequestClosed}
            heading={
                viserHistoriskPeriode || !underOppfolging || !harSkriveTilgang
                    ? 'Mitt mål fra en tidligere periode'
                    : 'Mitt mål'
            }
        >
            <div>
                <ReadMore className="mb-8" header="Tips til mål" defaultOpen={historiskeMal.length === 0}>
                    Skriv noen ord om hva som er målet ditt slik at vi kan veilede deg bedre.
                    <ul className="list-disc mt-4 pl-8">
                        <li>Hva er målet på kort sikt? Hva er målet på lengre sikt?</li>
                        <li>Hva slags arbeidsoppgaver ønsker du deg?</li>
                    </ul>
                </ReadMore>
                <Innholdslaster className="flex m-auto" avhengigheter={avhengigheter} alleOK>
                    <section>
                        <MalContainer onLagre={onModalRequestClosed} dirtyRef={isDirty} />
                        <MalHistorikk />
                    </section>
                </Innholdslaster>
            </div>
        </MalModal>
    );
};

export default Mal;
