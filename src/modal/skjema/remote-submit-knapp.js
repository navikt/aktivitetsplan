import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-react-design/dist/knapp';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

const cls = className => classNames(className, 'knapp-liten');
const RemoteSubmitKnapp = ({ className, dispatch, formNavn }) =>
    <Hovedknapp
        className={cls(className)}
        onClick={() => dispatch(submit(formNavn))}
    >
        <FormattedMessage id="modal.skjema.lagre" />
    </Hovedknapp>;

RemoteSubmitKnapp.propTypes = {
    className: PT.string,
    dispatch: PT.func,
    formNavn: PT.string,
};

RemoteSubmitKnapp.defaultProps = {
    className: undefined,
    dispatch: undefined,
    formNavn: undefined,
};

export default connect()(RemoteSubmitKnapp);
