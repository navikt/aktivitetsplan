import './mitt-maal.less';

import { Alert, Button, Heading, Skeleton } from '@navikt/ds-react';
import classNames from 'classnames';
import { isAfter, parseISO } from 'date-fns';
import React, { Suspense, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Await, useRouteLoaderData } from 'react-router-dom';

import { Lest } from '../../datatypes/lestTypes';
import { Mal, Me } from '../../datatypes/oppfolgingTypes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import NotifikasjonMarkering from '../../felles-komponenter/utils/NotifikasjonMarkering';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectIdentitetData } from '../identitet/identitet-selector';
import { selectLestAktivitetsplan } from '../lest/lest-selector';
import { selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-selector';
import { hentMal } from '../mal/aktivitetsmal-slice';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import MaalIkon from './Aktivitetsplan_maal.svg?react';
import { InitialPageLoadResult } from '../../routing/loaders';
import MalContent from './MalContent';

function MittMaal() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentMal());
    }, []);

    const avhengigheter = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal: string | undefined = malData && malData.mal;

    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const disabled = !underOppfolging || viserHistoriskPeriode || !harSkriveTilgang;
    const nyEndring =
        erNyEndringIMal(
            malData,
            useSelector(selectLestAktivitetsplan) as any,
            useSelector(selectIdentitetData) as any,
        ) && harSkriveTilgang;

    const noeHarFeilet = avhengigheter === 'ERROR';
    const { mal: malPromise, oppfolging: oppfolgingPromise } = useRouteLoaderData('root') as InitialPageLoadResult;
    if (noeHarFeilet) return <Alert variant={'error'}>Kunne ikke hente mål</Alert>;
    return (
        <>
            <div
                className={classNames('border-border-default flex rounded-md p-4', {
                    'border-2 border-dashed ': !mal && !disabled,
                    border: mal || disabled,
                })}
            >
                <div className="flex sm:flex-row items-center gap-6">
                    <MaalIkon aria-hidden={true} role="img" className="hidden sm:block mx-4 min-w-fit" />
                    <div>
                        <div className="flex mb-2 items-center">
                            <NotifikasjonMarkering visible={nyEndring} />
                            <Heading level="2" size="medium" className={'flex'}>
                                Mitt mål
                            </Heading>
                        </div>
                        <Suspense fallback={<MalFallback />}>
                            <Await resolve={Promise.all([oppfolgingPromise, malPromise])}>
                                <MalContent disabled={disabled} mal={mal} />
                            </Await>
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
}

const MalFallback = () => {
    return (
        <div className="flex flex-col items-start gap-4">
            <Skeleton variant="text" width="100%" />
            <Button size="small" variant="secondary" disabled={true}>
                Endre målet
            </Button>
        </div>
    );
};

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
        parseISO(aktivitetsplanLestInfo.tidspunkt),
    );

    return !sisteEndringVarFraMeg && !maal.lest && maalLagdEtterSistLestAktivitetsplan;
}

export default MittMaal;
