import PT from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetEtikett } from '../../aktivitetliste-selector';
import SokeStatusEtikett from '../../etikett/SokeStatusEtikett';
import EndreLinje from '../endre-linje/endre-linje';
import StillingEtikettForm from './StillingEtikettForm';

function OppdaterAktivitetEtikett(props) {
    const { aktivitet, disableEtikettEndringer, lagreEtikett } = props;
    const [endring, setEndring] = useState(false);

    const onSubmit = (val) =>
        lagreEtikett(val).then(() => {
            setEndring(false);
            document.querySelector('.aktivitet-modal').focus();
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
}

OppdaterAktivitetEtikett.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    disableEtikettEndringer: PT.bool.isRequired,
    lagreEtikett: PT.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    disableEtikettEndringer:
        selectLasterAktivitetData(state) ||
        !selectKanEndreAktivitetEtikett(state, props.aktivitet) ||
        !selectErUnderOppfolging(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lagreEtikett: ({ etikettstatus }) => {
        if (etikettstatus === props.aktivitet.etikett) {
            return Promise.resolve();
        }

        const nyEtikett = etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;

        return dispatch(
            oppdaterAktivitetEtikett({
                ...props.aktivitet,
                etikett: nyEtikett,
            })
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterAktivitetEtikett);
