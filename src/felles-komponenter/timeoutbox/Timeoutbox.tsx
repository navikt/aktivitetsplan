import { Modal } from '@navikt/ds-react';
import { differenceInMilliseconds, parseISO, subMinutes } from 'date-fns';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectExpirationTime } from './auth-selector';
import TimeoutboxNedtelling from './TimeoutboxNedtelling';

const Timeoutbox = () => {
    const dispatch = useDispatch();

    const [manueltLukket, setManueltLukket] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(hentGjenstaendeInnloggetTid() as unknown as AnyAction);
    }, []);

    const expirationTimestamp = useSelector(selectExpirationTime);
    const expirationTimestampMinusFiveMinutes = subMinutes(parseISO(expirationTimestamp), 5);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (expirationTimestamp) {
            const expirationInMillis = differenceInMilliseconds(expirationTimestampMinusFiveMinutes, new Date());
            timer = setTimeout(() => {
                setOpen(true);
            }, expirationInMillis + 100);
        }
        return () => clearTimeout(timer);
    }, [expirationTimestamp]);

    if (!expirationTimestamp) {
        return null;
    }

    return (
        <Modal
            open={open && !manueltLukket}
            className="max-w-2xl"
            shouldCloseOnOverlayClick={false}
            overlayClassName="aktivitet-modal__overlay"
            onClose={() => {
                setManueltLukket(true);
            }}
        >
            <TimeoutboxNedtelling expirationTimestamp={expirationTimestamp} />
        </Modal>
    );
};

export default Timeoutbox;
