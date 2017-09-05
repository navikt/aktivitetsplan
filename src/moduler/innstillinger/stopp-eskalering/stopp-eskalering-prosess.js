import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';

function StoppEskaleringProsess({ intl, slettBegrunnelse }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.stopp-eskalering.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            onClick={() => {
                slettBegrunnelse();
                history.push('/innstillinger/stoppEskalering/');
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.stopp-eskalering.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

StoppEskaleringProsess.propTypes = {
    intl: intlShape.isRequired,
    slettBegrunnelse: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
    },
});

export default connect(null, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(StoppEskaleringProsess))
);
