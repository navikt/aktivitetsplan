import React, { MutableRefObject, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../../../../createGenericSlice';
import { SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { selectVeilederStatus } from '../../../veileder/veileder-selector';
import InnerSamtalereferatForm from './InnerSamtalereferatForm';

interface Props {
    onSubmit: (data: { status: string; avtalt: boolean }) => Promise<any>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: SamtalereferatAktivitet;
}

const SamtalereferatForm = (props: Props) => {
    const status = useSelector(selectVeilederStatus);
    const [ignorePending, setIgnorePending] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === Status.PENDING) {
                setIgnorePending(true);
            }
        }, 400);
        return clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (status === Status.PENDING && !ignorePending) {
        return null;
    }

    return <InnerSamtalereferatForm {...props} />;
};

export default SamtalereferatForm;
