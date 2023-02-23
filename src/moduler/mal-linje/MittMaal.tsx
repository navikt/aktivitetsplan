import './mitt-maal.less';

import { Add } from '@navikt/ds-icons';
import { Button, Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { Lest } from '../../datatypes/aktivitetTypes';
import { Mal, Me } from '../../datatypes/oppfolgingTypes';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import InternLenke from '../../felles-komponenter/utils/InternLenke';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import NotifikasjonMarkering from '../../felles-komponenter/utils/NotifikasjonMarkering';
import CustomBodyLong from '../aktivitet/visning/hjelpekomponenter/CustomBodyLong';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErVeileder, selectIdentitetData } from '../identitet/identitet-selector';
import { selectLestAktivitetsplan } from '../lest/lest-reducer';
import { hentMal, lesMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';

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

    return <CustomBodyLong formatLinebreaks>{props.mal}</CustomBodyLong>;
}

interface MalContentProps {
    mal?: string;
    disabled: boolean;
}

function MalContent(props: MalContentProps) {
    const { disabled, mal } = props;

    if (!mal && !disabled) {
        return (
            <div className="mittmal_callToAction">
                <Heading level="2" size="small">
                    Hva er målet ditt fremover?
                </Heading>
                <Button variant="tertiary" className="mittmal_knapp" form="kompakt">
                    <Add role="img" focusable="false" aria-hidden />
                    <span>Legg til</span>
                </Button>
            </div>
        );
    }

    return <MalText disabled={disabled} mal={mal} />;
}

function MittMaal() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentMal() as unknown as AnyAction);
    }, [dispatch]);

    const avhengigheter = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal: string | undefined = malData && malData.mal;

    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const disabled = !underOppfolging || viserHistoriskPeriode || !harSkriveTilgang;
    const cls = classNames('mitt-maal', { empty: !mal && !disabled });
    const nyEndring =
        erNyEndringIMal(malData, useSelector(selectLestAktivitetsplan), useSelector(selectIdentitetData)) &&
        harSkriveTilgang;

    return (
        <Innholdslaster className="mittmal_spinner" avhengigheter={avhengigheter}>
            <InternLenke
                skipLenkeStyling
                href="/mal"
                className={cls}
                onClick={() => {
                    loggMittMalKlikk(erVeileder);
                    dispatch(lesMal());
                }}
            >
                <div id="mittmal_header">
                    <NotifikasjonMarkering visible={nyEndring} />
                    Mitt mål
                </div>
                <div className="mittmal_content">
                    <MalContent disabled={disabled} mal={mal} />
                </div>
            </InternLenke>
        </Innholdslaster>
    );
}

function erNyEndringIMal(maal: Mal, aktivitetsplanLestInfo: Lest, me: Me): boolean {
    if (!maal?.mal) {
        return false;
    }

    const aldriLestAktivitetsplanen = !aktivitetsplanLestInfo;

    const sisteEndringVarFraMeg =
        (maal.endretAv === 'BRUKER' && me.erBruker) || (maal.endretAv === 'VEILEDER' && me.erVeileder);

    if (aldriLestAktivitetsplanen) {
        return !sisteEndringVarFraMeg;
    }

    const maalLagdEtterSistLestAktivitetsplan = moment(maal.dato).isAfter(aktivitetsplanLestInfo.tidspunkt);

    return !sisteEndringVarFraMeg && !maal.lest && maalLagdEtterSistLestAktivitetsplan;
}

export default MittMaal;
