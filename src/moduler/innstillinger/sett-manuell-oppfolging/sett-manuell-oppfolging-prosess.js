import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { STATUS } from '../../../ducks/utils';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import { SLETT_BEGRUNNELSE_ACTION } from '../../../ducks/situasjon';

function SettManuellOppfolgingProsess({ intl, laster, slettBegrunnelse }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.manuell.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            laster={laster}
            onClick={() => {
                slettBegrunnelse();
                history.push('/innstillinger/manuell');
            }}
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
    laster: PT.bool.isRequired,
    slettBegrunnelse: PT.func.isRequired,
};

const mapStateToProps = state => ({
    laster: state.data.situasjon.status === STATUS.RELOADING,
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => dispatch(SLETT_BEGRUNNELSE_ACTION),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(SettManuellOppfolgingProsess))
);
