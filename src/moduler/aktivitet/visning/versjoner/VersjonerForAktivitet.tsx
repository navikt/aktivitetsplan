import { ReadMore, Skeleton } from '@navikt/ds-react';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { EndringsLinje } from './EndringsLinje';
import { selectAktivitetHistorikk } from '../../aktivitet-selector';
import { Await, useParams } from 'react-router';
import { useAktivitetsVisningLoaderData } from '../../../../routing/loaders';
import { selectAktivitet } from '../../aktivitet-slice';
import { RootState } from '../../../../store/rootReducer';
import { AktivitetsId } from '../../../../datatypes/brandedTypes';

const MAX_SIZE = 10;

const VersjonerForAktivitet = () => {
    const { id: aktivitetId } = useParams<{ id: AktivitetsId }>();
    if (!aktivitetId) return null;
    const aktivitet = useSelector((store: RootState) => selectAktivitet(store, aktivitetId));
    if (!aktivitet) return null;
    const historikk = useSelector((state) => selectAktivitetHistorikk(state, aktivitetId)) || { endringer: [] };
    const endringer = historikk.endringer.map((endring, index) => {
        return {
            ...endring,
            erFørsteEndring: index === historikk.endringer.length - 1,
            erSisteEndring: index === 0,
        };
    });
    const versjonerInnslag = endringer
        .slice(0, MAX_SIZE)
        .map((endring) => (
            <EndringsLinje
                aktivitetsType={aktivitet.type}
                aktivitetId={aktivitetId}
                key={endring.tidspunkt}
                endring={endring}
            />
        ));
    const versjonerInnslagUnderAccordion = (
        <ReadMore header="Vis mer">
            {endringer.slice(MAX_SIZE).map((endring) => (
                <EndringsLinje
                    aktivitetsType={aktivitet.type}
                    aktivitetId={aktivitetId}
                    key={endring.tidspunkt}
                    endring={endring}
                />
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
