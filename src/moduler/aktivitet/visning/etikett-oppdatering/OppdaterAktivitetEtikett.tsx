import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import * as statuser from '../../../../constant';
import { Aktivitet } from '../../../../types';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetEtikett } from '../../aktivitetliste-selector';
import SokeStatusEtikett from '../../etikett/SokeStatusEtikett';
import EndreLinje from '../endre-linje/endre-linje';
import StillingEtikettForm from './StillingEtikettForm';

interface Props {
    aktivitet: Aktivitet;
}

const OppdaterAktivitetEtikett = (props: Props) => {
    const { aktivitet } = props;

    const lasterAktivitetData = useSelector(selectLasterAktivitetData, shallowEqual);
    const kanIkkeEndreAktivitet = !useSelector(
        (state) => selectKanEndreAktivitetEtikett(state, aktivitet),
        shallowEqual
    );
    const erIkkeUnderOppfolging = !useSelector(selectErUnderOppfolging);

    const [endring, setEndring] = useState(false);
    const dispatch = useDispatch();
    const disableEtikettEndringer = lasterAktivitetData || kanIkkeEndreAktivitet || erIkkeUnderOppfolging;

    const lagreEtikett = ({ etikettstatus }: { etikettstatus: string }): Promise<any> => {
        if (etikettstatus === aktivitet.etikett) {
            return Promise.resolve();
        }

        const nyEtikett = etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;

        return oppdaterAktivitetEtikett({
            ...aktivitet,
            etikett: nyEtikett,
        })(dispatch);
    };

    const onSubmit = (val: { etikettstatus: string }): Promise<any> =>
        lagreEtikett(val).then(() => {
            setEndring(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });

    const form = <StillingEtikettForm disabled={disableEtikettEndringer} aktivitet={aktivitet} onSubmit={onSubmit} />;

    return (
        <EndreLinje
            tittel="Hvor langt har du kommet i søknadsprosessen?"
            form={form}
            endring={endring}
            setEndring={setEndring}
            visning={<SokeStatusEtikett etikett={aktivitet.etikett} />}
        />
    );
};

export default OppdaterAktivitetEtikett;
