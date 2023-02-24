import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import * as statuser from '../../../../constant';
import { StillingsStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetEtikett } from '../../aktivitetlisteSelector';
import StillingEtikett from '../../etikett/StillingEtikett';
import EndreLinje from '../endre-linje/EndreLinje';
import StillingEtikettForm from './StillingEtikettForm';

interface Props {
    aktivitet: StillingAktivitet;
}

interface EtikettValue {
    etikettstatus: StillingsStatus;
}

const OppdaterAktivitetEtikett = (props: Props) => {
    const { aktivitet } = props;

    const lasterAktivitetData = useSelector(selectLasterAktivitetData, shallowEqual);
    const kanIkkeEndreAktivitet = !useSelector(
        (state) => selectKanEndreAktivitetEtikett(state, aktivitet),
        shallowEqual
    );
    const erIkkeUnderOppfolging = !useSelector(selectErUnderOppfolging);

    const [open, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const lagreEtikett = (val: EtikettValue): Promise<any> => {
        const { etikettstatus } = val;

        if (etikettstatus === aktivitet.etikett) {
            return Promise.resolve();
        }

        const etikett = etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;

        return oppdaterAktivitetEtikett({
            ...aktivitet,
            etikett,
        })(dispatch);
    };

    const onSubmit = (val: EtikettValue): Promise<any> =>
        lagreEtikett(val).then(() => {
            setIsOpen(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });

    const disableEtikettEndringer = lasterAktivitetData || kanIkkeEndreAktivitet || erIkkeUnderOppfolging;

    const form = <StillingEtikettForm disabled={disableEtikettEndringer} aktivitet={aktivitet} onSubmit={onSubmit} />;

    return (
        <EndreLinje
            onClick={() => setIsOpen(!open)}
            open={open}
            tittel="Hvor langt har du kommet i søknadsprosessen?"
            form={form}
            subtittel={<StillingEtikett aktivitet={aktivitet} />}
        />
    );
};

export default OppdaterAktivitetEtikett;
