import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalHeader from '../modal-header';
import StillingAktivitetForm from '../skjema/stilling-aktivitet-form';
import EgenAktivitetForm from '../skjema/egen-aktivitet-form';
import history from '../../history';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE } from '../../constant';
import ModalContainer from '../modal-container';


function EndreAktivitet(props) {
    const { doOppdaterAktivitet, aktivitet } = props;
    if (!aktivitet) {
        return null;
    }

    function renderForm() {
        function oppdater(aktivitetData) {
            const oppdatertAktivitet = { ...aktivitet, ...aktivitetData };
            doOppdaterAktivitet(oppdatertAktivitet);
            history.push(`aktivitet/aktivitet/${oppdatertAktivitet.id}`);
        }

        switch (aktivitet.type) {
            case STILLING_AKTIVITET_TYPE:
                return <StillingAktivitetForm aktivitet={aktivitet} onSubmit={oppdater} />;
            case EGEN_AKTIVITET_TYPE:
                return <EgenAktivitetForm aktivitet={aktivitet} onSubmit={oppdater} />;
            default:
                return null;
        }
    }

    return (
        <article className="egen-aktivitet" aria-labelledby="modal-egen-aktivitet-header">
            <ModalHeader tilbakeTekstId="endre-aktivitet.tilbake" />
            <ModalContainer>
                {renderForm()}
            </ModalContainer>
        </article>
    );
}


EndreAktivitet.propTypes = {
    doOppdaterAktivitet: PT.func.isRequired,
    aktivitet: AppPT.aktivitet
};

const mapStateToProps = (state, props) => {
    const id = props.params.id;
    const aktivitet = state.data.aktiviteter.data.find((a) => a.id === id);
    return {
        aktivitet
    };
};

const mapDispatchToProps = (dispatch) => ({
    doOppdaterAktivitet: (aktivitet) => oppdaterAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreAktivitet);
