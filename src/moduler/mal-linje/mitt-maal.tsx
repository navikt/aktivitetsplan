import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { Element } from 'nav-frontend-typografi';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../../moduler/mal/aktivitetsmal-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import { selectViserHistoriskPeriode } from '../../moduler/filtrering/filter/filter-selector';
import './mitt-maal.less';

interface MalTextProps {
    mal: string;
    disabled: boolean;
}

function MalText(props: MalTextProps) {
    if (props.disabled) {
        return <>Trykk her for å se dine tidligere mål</>;
    }
    if (!props.mal) {
        return (
            <>
                Du har ikke skrevet hva målet ditt er. Beskriv målet ditt, gjerne både kortsiktige og langsiktige mål og
                hva slags arbeidsoppgaver du ønsker deg.
            </>
        );
    }

    return <Tekstomrade>{props.mal}</Tekstomrade>;
}

function MittMaal() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentMal());
    }, [dispatch]);

    const avhengigheter = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal = malData && malData.mal;

    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);

    return (
        <InternLenke skipLenkeStyling href="/mal" className="mitt-maal" onClick={() => loggMittMalKlikk(erVeileder)}>
            <Element className="mittmal_header">Ditt mål</Element>
            <div className="mittmal_content">
                <Innholdslaster className="mittmal_spinner" avhengigheter={avhengigheter}>
                    <MalText disabled={!underOppfolging || viserHistoriskPeriode} mal={mal} />
                </Innholdslaster>
            </div>
        </InternLenke>
    );
}

export default MittMaal;
