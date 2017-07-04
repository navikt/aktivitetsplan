import React from 'react';
import PT from 'prop-types';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';

const SubmitKnapp = ({
    className,
    dispatch,
    formNavn,
    children,
    mini,
    ...rest
}) =>
    <Hovedknapp
        className={className}
        onClick={() => dispatch(submit(formNavn))}
        mini={mini}
        {...rest}
    >
        {children}
    </Hovedknapp>;

SubmitKnapp.propTypes = {
    className: PT.string,
    dispatch: PT.func,
    formNavn: PT.string.isRequired,
    children: PT.node.isRequired,
    mini: PT.bool,
};

SubmitKnapp.defaultProps = {
    className: undefined,
    dispatch: undefined,
    formNavn: undefined,
    mini: false,
};

const ResetKnapp = ({
    className,
    dispatch,
    formNavn,
    children,
    onClick,
    ...rest
}) =>
    <Knapp
        className={className}
        onClick={() => {
            dispatch(reset(formNavn));
            onClick();
        }}
        {...rest}
    >
        {children}
    </Knapp>;

ResetKnapp.propTypes = {
    className: PT.string,
    dispatch: PT.func,
    formNavn: PT.string.isRequired,
    children: PT.node.isRequired,
    mini: PT.bool,
    onClick: PT.func,
};

ResetKnapp.defaultProps = {
    className: undefined,
    dispatch: undefined,
    formNavn: undefined,
    mini: false,
    onClick: () => {},
};

export const RemoteSubmitKnapp = connect()(SubmitKnapp);
export const RemoteResetKnapp = connect()(ResetKnapp);
