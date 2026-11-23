import { Alert, Heading, Skeleton } from '@navikt/ds-react';
import { CompassIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { isAfter, parseISO } from 'date-fns';
import React, { Suspense } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Await, useRouteLoaderData } from 'react-router';

import { Lest } from '../../datatypes/lestTypes';
import { Mal, Me } from '../../datatypes/oppfolgingTypes';
import NotifikasjonMarkering from '../../felles-komponenter/utils/NotifikasjonMarkering';
import { selectIdentitetData } from '../identitet/identitet-selector';
import { selectLestAktivitetsplan } from '../lest/lest-selector';
import { selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-selector';
import { InitialPageLoadResult } from '../../routing/loaders';
import MalContent from './MalContent';
import { ReadWriteMode, selectReadWriteMode } from '../../utils/readOrWriteModeSlice';

function MittMaal() {
    const avhengigheter = useSelector(selectMalStatus, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal: string | undefined = malData && malData.mal;
    const readOnly = useSelector(selectReadWriteMode, shallowEqual) == ReadWriteMode.READ;

    const disabled = readOnly;
    const nyEndring =
        erNyEndringIMal(
            malData,
            useSelector(selectLestAktivitetsplan) as any,
            useSelector(selectIdentitetData) as any,
        ) && readOnly;

    const noeHarFeilet = avhengigheter === 'ERROR';
    const { mal: malPromise } = useRouteLoaderData('root') as InitialPageLoadResult;
    if (noeHarFeilet) return <Alert variant={'error'}>Kunne ikke hente mål</Alert>;
    return (
        <div
            className={classNames(
                'flex w-full flex-row items-start gap-3 rounded-lg border-2 bg-ax-bg-default px-4 py-3 sm:items-center sm:px-4 sm:py-2',
                {
                    'border-dashed border-ax-border-neutral-subtle': !mal && !disabled,
                    'border-solid border-ax-border-neutral-subtle': mal || disabled,
                },
            )}
        >
            <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
                <div className="flex shrink-0 items-center gap-2">
                    <NotifikasjonMarkering visible={nyEndring} />
                    <CompassIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <Heading level="2" size="small">
                        Mitt mål:
                    </Heading>
                </div>

                <Suspense fallback={<MalFallback />}>
                    <Await resolve={malPromise}>
                        <MalContent disabled={disabled} mal={mal} />
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}

const MalFallback = () => (
    <div className="flex flex-1 items-center sm:justify-end">
        <Skeleton variant="text" width="12rem" />
    </div>
);

function erNyEndringIMal(maal: Mal, aktivitetsplanLestInfo: Lest, me: Me): boolean {
    if (!maal?.mal || !maal.dato) {
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
