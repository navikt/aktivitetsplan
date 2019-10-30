import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../../moduler/mal/aktivitetsmal-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import { selectViserHistoriskPeriode } from '../../moduler/filtrering/filter/filter-selector';
import './mitt-maal.less';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import { ABMAL, harFeature } from '../../felles-komponenter/feature/feature';
import { ReactComponent as Pluss } from './pluss.svg';

interface MalTextProps {
    mal?: string;
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

interface MalContentProps {
    disabled: boolean;
    abTest: boolean;
    mal?: string;
}

function MalContent(props: MalContentProps) {
    const { disabled, abTest, mal } = props;

    if (!mal && abTest) {
        return (
            <div className="mittmal_callToAction">
                <Element>Hva er målet ditt fremover?</Element>
                <Flatknapp className="mittmal_knapp" form="kompakt">
                    <Pluss />
                    <span>Legg til</span>
                </Flatknapp>
            </div>
        );
    }

    return <MalText disabled={disabled} mal={mal} />;
}

function MittMaal() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentMal());
    }, [dispatch]);

    const avhengigheter = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal: string | undefined = malData && malData.mal;

    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const features = useSelector(selectFeatureData);

    const abTest = harFeature(ABMAL, features);
    const cls = classNames('mitt-maal', { empty: !mal && abTest });

    //todo: spinner, unleash, innhold

    return (
        <Innholdslaster className="mittmal_spinner" avhengigheter={avhengigheter}>
            <InternLenke skipLenkeStyling href="/mal" className={cls} onClick={() => loggMittMalKlikk(erVeileder)}>
                <Element className="mittmal_header">Ditt mål</Element>
                <div className="mittmal_content">
                    <MalContent disabled={!underOppfolging || viserHistoriskPeriode} abTest={abTest} mal={mal} />
                </div>
            </InternLenke>
        </Innholdslaster>
    );
}

export default MittMaal;
