import { Accordion, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';

import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';
import { logAccordionAapnet } from '../../../../analytics/analytics';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { AktivitetsId } from '../../../../datatypes/brandedTypes';
import { hentAktivitetHistorikk } from '../../aktivitet-actions';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';

const EndringsLogg = ({
    aktivitetsType,
    aktivitetsId,
}: {
    aktivitetsType: VeilarbAktivitetType;
    aktivitetsId: AktivitetsId;
}) => {
    const [open, setOpen] = useState(false);
    const [shouldRefetchHistoryOnOpen, setShouldRefetchHistoryOnOpen] = useState(false);
    const dispatch = useAppDispatch();

    function handleClick() {
        if (!open && shouldRefetchHistoryOnOpen) {
            dispatch(hentAktivitetHistorikk(aktivitetsId));
        }

        if (!open) {
            logAccordionAapnet('Historikk', aktivitetsType);
        }
        setOpen(!open);
        /* Vi henter historikk ved første innlasting av aktivitet men etter dette kan aktiviteten ha endret seg */
        if (open) {
            setShouldRefetchHistoryOnOpen(true);
        }
    }

    return (
        <Accordion.Item open={open}>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small" className="flex text-ax-text-neutral">
                    Historikk
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
