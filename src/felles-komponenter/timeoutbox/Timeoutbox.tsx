import { Modal } from '@navikt/ds-react';
import { differenceInMilliseconds, parseISO, subMinutes } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../hooks/useAppDispatch';
import { selectExpirationTime } from './auth-selector';
import { hentAuthInfo } from './auth-slice';
import TimeoutboxNedtelling from './TimeoutboxNedtelling';

const Timeoutbox = () => {
    const dispatch = useAppDispatch();

    const [manueltLukket, setManueltLukket] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(hentAuthInfo());
    }, []);

    const expirationTimestamp = useSelector(selectExpirationTime);
    const expirationTimestampMinusFiveMinutes =
        expirationTimestamp !== null && expirationTimestamp !== undefined
            ? subMinutes(parseISO(expirationTimestamp), 5)
            : undefined;

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (expirationTimestampMinusFiveMinutes) {
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
            onClose={() => {
                setManueltLukket(true);
            }}
            header={{ heading: 'Obs!', closeButton: true }}
        >
            <TimeoutboxNedtelling expirationTimestamp={expirationTimestamp} />
        </Modal>
    );
};

export default Timeoutbox;
