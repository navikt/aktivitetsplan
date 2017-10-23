import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { VenstreChevron } from 'nav-frontend-chevron';
import Lenke from './lenke';
import history from '../../history';
import { TILBAKE_MODAL } from '../modal/modal-reducer';

function Tilbakeknapp(props) {
    function tilbake(e) {
        e.preventDefault();
        const dialogTekst = props.intl.formatMessage({
            id: 'aktkivitet-skjema.lukk-advarsel',
        });
        // eslint-disable-next-line no-alert
        if (!props.visConfirmDialog || confirm(dialogTekst)) {
            props.tilbakeModal();
            history.goBack();
        }
    }

    return (
        <Lenke href="/" onClick={tilbake} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">
                    <FormattedMessage
                        id={props.tekstId}
                        values={props.tekstValues}
                    />
                </span>
            </div>
        </Lenke>
    );
}

Tilbakeknapp.defaultProps = {
    tekstValues: undefined,
    visConfirmDialog: false,
};

Tilbakeknapp.propTypes = {
    tekstId: PT.string.isRequired,
    tekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    tilbakeModal: PT.func.isRequired,
    visConfirmDialog: PT.bool,
    intl: intlShape.isRequired,
};

const mapDispatchToProps = dispatch => ({
    tilbakeModal: () => dispatch({ type: TILBAKE_MODAL }),
});

export default connect(null, mapDispatchToProps)(injectIntl(Tilbakeknapp));
