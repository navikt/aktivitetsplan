import { BriefcaseIcon } from '@navikt/aksel-icons';
import { isRejected } from '@reduxjs/toolkit';
import React, { useContext, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { StillingStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useErVeileder } from '../../../../Provider';
import { DirtyContext } from '../../../context/dirty-context';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { kanEndreAktivitetEtikett } from '../../aktivitetlisteSelector';
import StillingEtikett from '../../etikett/StillingEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import StillingEtikettForm, { StillingEtikettFormValues } from './StillingEtikettForm';
import { ReadWriteMode, selectReadWriteMode } from '../../../../utils/readOrWriteModeSlice';

interface Props {
    aktivitet: StillingAktivitet;
}

const OppdaterAktivitetEtikett = (props: Props) => {
    const { aktivitet } = props;
    const erVeileder = useErVeileder();

    const lasterAktivitetData = useSelector(selectLasterAktivitetData, shallowEqual);
    const kanIkkeEndreAktivitet = !kanEndreAktivitetEtikett(aktivitet, erVeileder);
    const readOnly = useSelector(selectReadWriteMode) == ReadWriteMode.READ;

    const [open, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const lagreEtikett = async (formValues: StillingEtikettFormValues) => {
        const { etikettstatus } = formValues;

        if (etikettstatus === aktivitet.etikett) {
            setIsOpen(false);
            return;
        }
        const etikett = etikettstatus === StillingStatus.INGEN_VALGT ? undefined : etikettstatus;

        return dispatch(oppdaterAktivitetEtikett({ ...aktivitet, etikett })).then((action) => {
            if (isRejected(action)) return;
            setIsOpen(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });
    };

    const onSubmit = (formValues: StillingEtikettFormValues): Promise<any> => {
        setFormIsDirty('etikett', false);
        return lagreEtikett(formValues);
    };

    const disableEtikettEndringer = lasterAktivitetData || kanIkkeEndreAktivitet || readOnly;

    const { setFormIsDirty } = useContext(DirtyContext);
    const form = <StillingEtikettForm disabled={disableEtikettEndringer} aktivitet={aktivitet} onSubmit={onSubmit} />;

    return (
        <EndreLinje
            icon={<BriefcaseIcon fontSize="1.5rem" />}
            onClick={() => {
                if (open) {
                    setFormIsDirty('etikett', false);
                }
                setIsOpen(!open);
            }}
            open={open}
            tittel="Hvor langt har du kommet i søknadsprosessen?"
            subtittel={<StillingEtikett aktivitet={aktivitet} />}
            content={form}
        />
    );
};

export default OppdaterAktivitetEtikett;
