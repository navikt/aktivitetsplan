import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';

function SettManuellOppfolgingProsess({ intl, slettBegrunnelse }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.manuell.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            onClick={() => slettBegrunnelse()}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.manuell.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

SettManuellOppfolgingProsess.propTypes = {
    intl: intlShape.isRequired,
    slettBegrunnelse: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        history.push('/innstillinger/manuell');
    },
});

export default connect(null, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(SettManuellOppfolgingProsess))
);
