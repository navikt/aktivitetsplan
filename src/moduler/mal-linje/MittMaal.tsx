import './mitt-maal.less';

import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import { isAfter, parseISO } from 'date-fns';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from 'redux';

import { Lest } from '../../datatypes/aktivitetTypes';
import { Mal, Me } from '../../datatypes/oppfolgingTypes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster, { Avhengighet } from '../../felles-komponenter/utils/Innholdslaster';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import NotifikasjonMarkering from '../../felles-komponenter/utils/NotifikasjonMarkering';
import { useErVeileder } from '../../Provider';
import CustomBodyLong from '../aktivitet/visning/hjelpekomponenter/CustomBodyLong';
import { selectViserHistoriskPeriode, selectViserInneverendePeriode } from '../filtrering/filter/filter-selector';
import { selectIdentitetData } from '../identitet/identitet-selector';
import { selectLestAktivitetsplan } from '../lest/lest-reducer';
import { hentMal, lesMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { ReactComponent as MaalIkon } from './Aktivitetsplan_maal.svg';

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
    const dispatch = useAppDispatch();
    const erVeileder = useErVeileder();
    const navigate = useNavigate();
    const endreMal = () => {
        navigate('/mal');
        loggMittMalKlikk(erVeileder);
        dispatch(lesMal());
    };
    const viserInnevaerendePeriode = useSelector(selectViserInneverendePeriode, shallowEqual);

    if (!mal && !disabled) {
        return (
            <div>
                <BodyShort>Skriv litt om hva som er målet ditt slik at vi kan hjelpe deg bedre.</BodyShort>
                <ul className="list-disc ml-6 mb-4">
                    <li>
                        <BodyShort>Hva er målet på kort og på lang sikt?</BodyShort>
                    </li>
                    <li>
                        <BodyShort>Hva slags jobb ønsker du deg?</BodyShort>
                    </li>
                </ul>
                <Button onClick={endreMal} variant="secondary" size="small">
                    Sett et mål
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-4">
            <MalText disabled={disabled} mal={mal} />
            <Button onClick={endreMal} variant="secondary" size="small">
                {viserInnevaerendePeriode ? 'Endre målet' : 'Se tidligere mål'}
            </Button>
        </div>
    );
}

function MittMaal() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentMal());
    }, [dispatch]);

    const avhengigheter: Avhengighet = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal: string | undefined = malData && malData.mal;

    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const disabled = !underOppfolging || viserHistoriskPeriode || !harSkriveTilgang;
    const nyEndring =
        erNyEndringIMal(malData, useSelector(selectLestAktivitetsplan), useSelector(selectIdentitetData)) &&
        harSkriveTilgang;

    const noeHarFeilet = avhengigheter === 'ERROR';
    return (
        <>
            <Innholdslaster avhengigheter={avhengigheter}>
                <div
                    className={classNames('border-border-default flex rounded-md p-4', {
                        'border-2 border-dashed ': !mal && !disabled,
                        border: mal || disabled,
                    })}
                >
                    <div className="flex sm:flex-row items-center gap-6">
                        <MaalIkon role="img" className="hidden sm:block mx-4 min-w-fit" />
                        <div>
                            <div className="flex mb-2">
                                <NotifikasjonMarkering visible={nyEndring} />
                                <Heading level="2" size="medium" className={'flex'}>
                                    Mitt mål
                                </Heading>
                            </div>
                            <MalContent disabled={disabled} mal={mal} />
                        </div>
                    </div>
                </div>
            </Innholdslaster>
            {noeHarFeilet ? <Alert variant={'error'}>Kunne ikke hente mål</Alert> : null}
        </>
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

    const maalLagdEtterSistLestAktivitetsplan = isAfter(
        parseISO(maal.dato),
        parseISO(aktivitetsplanLestInfo.tidspunkt)
    );

    return !sisteEndringVarFraMeg && !maal.lest && maalLagdEtterSistLestAktivitetsplan;
}

export default MittMaal;
