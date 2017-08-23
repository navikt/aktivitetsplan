import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import { stoppEskalering } from '../innstillinger-reducer';
import { hentSituasjon } from '../../situasjon/situasjon';
import { STATUS } from '../../../ducks/utils';
import * as AppPT from '../../../proptypes';

function StoppEskaleringProsess({
    intl,
    handleStoppEskalering,
    innstillingerReducer,
}) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.stopp-eskalering.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            onClick={() => handleStoppEskalering()}
            laster={
                innstillingerReducer.status === STATUS.PENDING ||
                innstillingerReducer.status === STATUS.RELOADING
            }
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
    handleStoppEskalering: PT.func.isRequired,
    innstillingerReducer: AppPT.reducer.isRequired,
};

const mapStateToProps = state => ({
    innstillingerReducer: state.data.innstillinger,
});

const mapDispatchToProps = dispatch => ({
    handleStoppEskalering: () => {
        dispatch(stoppEskalering())
            .then(() =>
                history.push('/innstillinger/stoppEskalering/kvittering')
            )
            .then(() => dispatch(hentSituasjon()))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(StoppEskaleringProsess))
);
