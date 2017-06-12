import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalFooter from '../modal-footer';
import history from '../../history';
import { AVSLUTT_FORM_NAME } from './avslutt-oppfolginsperiode';

function BekreftAvslutning({ lagreBegrunnelse, begrunnelse, navn }) {
    return (
        <div>
            <section className="innstillinger__avslutt-periode">
                <div className="blokk-xs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-m">
                    <FormattedMessage
                        id="innstillinger.modal.avslutt.bekreft.alert-melding"
                        values={{ navn }}
                    />
                </AlertStripeInfoSolid>
            </section>
            <ModalFooter>
                <Hovedknapp mini onClick={() => lagreBegrunnelse(begrunnelse)}>
                    <FormattedMessage id="innstillinger.modal.avslutt.bekreft.knapp.bekreft" />
                </Hovedknapp>
                <Knapp mini onClick={() => history.push('/')}>
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                </Knapp>
            </ModalFooter>
        </div>
    );
}
BekreftAvslutning.defaultProps = {
    begrunnelse: undefined,
    navn: undefined,
};

BekreftAvslutning.propTypes = {
    navn: PT.string,
    begrunnelse: PT.string,
    lagreBegrunnelse: PT.func.isRequired,
};

const mapStateToProps = state => ({
    navn: state.data.motpart.data.navn,
    begrunnelse: formValueSelector(AVSLUTT_FORM_NAME)(state, 'begrunnelse'),
});

const mapDispatchToProps = () => ({
    lagreBegrunnelse: () => {
        // dispatch(avsluttOppfolging(props.begrunnelse)); TODO: må finne ut hvilket endepunkt som skal benyttes
        history.push('/innstillinger/avslutt/kvittering');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BekreftAvslutning);
