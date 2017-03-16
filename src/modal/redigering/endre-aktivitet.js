import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-react-design/dist/typografi';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import * as AppPT from '../../proptypes';
import ModalHeader from '../modal-header';
import StillingAktivitetForm from '../skjema/stilling-aktivitet-form';
import EgenAktivitetForm from '../skjema/egen-aktivitet-form';
import history from '../../history';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE } from '../../constant';
import ModalScrollVindu from './../modal-scroll-vindu';
import ModalFooter from './../modal-footer';
import RemoteSubmitKnapp from './../skjema/remote-submit-knapp';


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

    function renderKnapper() {
        switch (aktivitet.type) {
            case STILLING_AKTIVITET_TYPE:
                return <RemoteSubmitKnapp formNavn="stilling-aktivitet" className="modal-footer__knapp" />;
            case EGEN_AKTIVITET_TYPE:
                return <RemoteSubmitKnapp formNavn="egen-aktivitet" className="modal-footer__knapp" />;
            default:
                return null;
        }
    }

    return (
        <ModalHeader tilbakeTekstId="endre-aktivitet.tilbake">
            <ModalScrollVindu>
                <Undertittel className="aktivitetskjema__redigering-header"><FormattedMessage id="endre-aktivitet.overskrift" /></Undertittel>
                {renderForm()}
            </ModalScrollVindu>
            <ModalFooter>
                {renderKnapper()}
            </ModalFooter>
        </ModalHeader>
    );
}


EndreAktivitet.propTypes = {
    doOppdaterAktivitet: PT.func.isRequired,
    aktivitet: AppPT.aktivitet
};

const mapStateToProps = (state, props) => {
    const id = props.params.id;
    const aktivitet = state.data.aktiviteter.find((a) => a.id === id);
    return {
        aktivitet
    };
};

const mapDispatchToProps = (dispatch) => ({
    doOppdaterAktivitet: (aktivitet) => oppdaterAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreAktivitet);
