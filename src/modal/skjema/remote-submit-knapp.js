import React, { PropTypes as PT } from 'react';
import { Hovedknapp } from 'nav-react-design/dist/knapp';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

const cls = (className) => classNames(className, 'knapp-liten');
const RemoteSubmitKnapp = ({ className, dispatch, formNavn }) => (
    <Hovedknapp className={cls(className)} onClick={() => dispatch(submit(formNavn))}>Lagre</Hovedknapp>
);

RemoteSubmitKnapp.propTypes = {
    className: PT.string,
    dispatch: PT.func,
    formNavn: PT.string
};

export default connect()(RemoteSubmitKnapp);
