import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import NyHenvendelse from './ny-henvendelse';
import EndreDialog from './endre-dialog';
import Henvendelser from './henvendelser';
import * as AppPT from '../proptypes';



function Dialog({ dialog, overskrift, className }) {
    const dialogId = dialog.id;
    return (
        <div className={className}>
            <Undertittel >{overskrift}</Undertittel>
            <Element>
                <FormattedMessage id="dialog.deg-og-nav.tittel" />
            </Element>
            <NyHenvendelse formNavn={`ny-henvendelse-dialog-${dialogId}`} dialogId={dialogId} />
            <EndreDialog formNavn={`endre-dialog-${dialogId}`} dialog={dialog} />
            <Henvendelser dialog={dialog} />
        </div>
    );
}

Dialog.propTypes = {
    className: PT.string,
    overskrift: PT.string,
    dialog: AppPT.dialog.isRequired
};

Dialog.defaultProps = {
    overskrift: undefined,
    className: undefined
};

const mapStateToProps = (state,props) => {
    const dialog = props.dialog;
    const aktivitet = state.data.aktiviteter.data.find(a => a.id === dialog.aktivitetId) || {};
    return {
        overskrift: aktivitet.tittel || dialog.overskrift
    };
};

export default connect(mapStateToProps)(Dialog);
