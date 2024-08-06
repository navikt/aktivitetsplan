import { ReadMore, Skeleton } from '@navikt/ds-react';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { EndringsLinje } from './EndringsLinje';
import { selectAktivitetHistorikk } from '../../aktivitet-selector';
import { Await, useParams } from 'react-router-dom';
import { useAktivitetsVisningLoaderData } from '../../../../routing/loaders';

const MAX_SIZE = 10;

const VersjonerForAktivitet = () => {
    const aktivitetId = useParams<{ id: string }>().id!!;
    const historikk = useSelector((state) => selectAktivitetHistorikk(state, aktivitetId)) || { endringer: [] };
    const versjonerInnslag = historikk.endringer
        .slice(0, MAX_SIZE)
        .map((endring) => <EndringsLinje key={endring.tidspunkt} endring={endring} />);
    const versjonerInnslagUnderAccordion = (
        <ReadMore header="Vis mer">
            {historikk.endringer.slice(MAX_SIZE).map((endring) => (
                <EndringsLinje key={endring.tidspunkt} endring={endring} />
            ))}
        </ReadMore>
    );
    return (
        <section>
            {versjonerInnslag}
            {(historikk?.endringer?.length || 0) > MAX_SIZE ? versjonerInnslagUnderAccordion : null}
        </section>
    );
};

const VersjonerForAktivitetWrapper = () => {
    const { aktivitet: aktivitetPromise } = useAktivitetsVisningLoaderData();
    return (
        <Suspense fallback={<EndringsloggFallback />}>
            <Await resolve={aktivitetPromise}>
                <VersjonerForAktivitet />
            </Await>
        </Suspense>
    );
};

const EndringsloggFallback = () => {
    return (
        <div>
            <Skeleton variant="text" width={250} />
            <Skeleton variant="text" width={150} />
        </div>
    );
};

export default VersjonerForAktivitetWrapper;
