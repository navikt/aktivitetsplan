import { BriefcaseIcon } from '@navikt/aksel-icons';
import React, { useContext, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { StillingStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useErVeileder } from '../../../../Provider';
import { DirtyContext } from '../../../context/dirty-context';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { kanEndreAktivitetEtikett } from '../../aktivitetlisteSelector';
import StillingEtikett from '../../etikett/StillingEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import StillingEtikettForm, { StillingEtikettFormValues } from './StillingEtikettForm';

interface Props {
    aktivitet: StillingAktivitet;
}

const OppdaterAktivitetEtikett = (props: Props) => {
    const { aktivitet } = props;
    const erVeileder = useErVeileder();

    const lasterAktivitetData = useSelector(selectLasterAktivitetData, shallowEqual);
    const kanIkkeEndreAktivitet = !kanEndreAktivitetEtikett(aktivitet, erVeileder);
    const erIkkeUnderOppfolging = !useSelector(selectErUnderOppfolging);

    const [open, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const lagreEtikett = (formValues: StillingEtikettFormValues): Promise<any> => {
        const { etikettstatus } = formValues;

        if (etikettstatus === aktivitet.etikett) {
            return Promise.resolve();
        }
        const etikett = etikettstatus === StillingStatus.INGEN_VALGT ? undefined : etikettstatus;

        return dispatch(oppdaterAktivitetEtikett({ ...aktivitet, etikett }));
    };

    const onSubmit = (formValues: StillingEtikettFormValues): Promise<any> => {
        setFormIsDirty('etikett', false);
        return lagreEtikett(formValues).then((action) => {
            if (action.error) return;
            setIsOpen(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });
    };

    const disableEtikettEndringer = lasterAktivitetData || kanIkkeEndreAktivitet || erIkkeUnderOppfolging;

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
