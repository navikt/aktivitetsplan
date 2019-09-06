import React, { useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import Etikett from '../../etikett/etikett';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import EndreLinje from '../endre-linje/endre-linje';
import Underseksjon from '../underseksjon/underseksjon';

// TODO do i need aktivitet status ?
function OppdaterAktivitetEtikett(props) {
    const { aktivitet, underOppfolging, lagreEtikett } = props;

    const [endring, setEndring] = useState(false);

    const disableStatusEndring =
        aktivitet.historisk ||
        aktivitet.status === statuser.STATUS_AVBRUTT ||
        aktivitet.status === statuser.STATUS_FULLFOERT;

    const visning = <Etikett etikett={aktivitet.etikett} />;

    const onSubmit = val =>
        lagreEtikett(val).then(() => {
            setEndring(false);
            document.querySelector('.aktivitet-modal').focus();
        });

    const form = (
        <StillingEtikettForm
            disabled={disableStatusEndring || !underOppfolging}
            aktivitet={aktivitet}
            onSubmit={onSubmit}
        />
    );

    return (
        <Underseksjon>
            <EndreLinje
                tittel="Hvor i søknadsprossen?"
                form={form}
                endring={endring}
                setEndring={setEndring}
                visning={visning}
            />
        </Underseksjon>
    );
}

OppdaterAktivitetEtikett.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    underOppfolging: PT.bool.isRequired,
    lagreEtikett: PT.func.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lagreEtikett: ({ etikettstatus }) => {
        const nyEtikett =
            etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;
        return dispatch(
            oppdaterAktivitetEtikett({
                ...props.aktivitet,
                etikett: nyEtikett,
            })
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterAktivitetEtikett
);
