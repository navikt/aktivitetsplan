import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { omit } from './utils';

export const cls = (className, props) => classNames('knapp', className, {
    'knapp-hoved': props.hoved,
    'knapp-fare': props.fare,
    'knapp-liten': props.storrelse === 'liten',
    'knapp-stor': props.storrelse === 'stor',
    // eslint-disable-next-line no-use-before-define
    'er-inaktiv': KnappBase.config.inaktivKlasseVedDisabled && props.disabled,
    'knapp-spinner': props.spinner
});

function skalVareDisabled(props) {
    if (KnappBase.config.autoDisableVedSpinner) { // eslint-disable-line no-use-before-define
        return props.disabled || props.spinner;
    }
    return props.disabled;
}

function KnappBase({ children, className, ...props }) {
    const spinner = props.spinner ? <span className="spinner-knapp" /> : null;
    const disabled = skalVareDisabled(props);
    const domProps = omit({ ...props, disabled }, 'hoved', 'fare', 'storrelse', 'spinner');

    return (
        <button role="button" className={cls(className, props)} {...domProps}>
            {children}
            {spinner}
        </button>
    );
}

KnappBase.config = {
    autoDisableVedSpinner: true,
    inaktivKlasseVedDisabled: false
};

KnappBase.propTypes = {
    children: PT.node.isRequired,
    className: PT.string,
    hoved: PT.bool,
    fare: PT.bool,
    storrelse: PT.oneOf(['liten', 'stor']),
    disabled: PT.bool,
    spinner: PT.bool
};

export default KnappBase;

export const Knapp = (props) => <KnappBase {...props} />;
export const Hovedknapp = (props) => <KnappBase hoved {...props} />;
export const Fareknapp = (props) => <KnappBase fare {...props} />;
