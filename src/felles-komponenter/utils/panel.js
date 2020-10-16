import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

export const cls = (className, props, ...args) =>
    classNames('panel', className, ...args, {
        'panel-ramme': props.ramme,
        'panel-ekstra': props.ekstra || props.skjema,
        'panel-relatert': props.relatert,
        'panel-stablet': props.stablet,
        'panel-fremhevet': props.fremhevet,
        'panel-negativ': props.negativ,
        'panel-komprimert': props.komprimert,
    });

function PanelBase({ className, children, ...props }) {
    return (
        <div className={cls(className, props)} {...props}>
            {children}
        </div>
    );
}

PanelBase.propTypes = {
    className: PT.string,
    children: PT.node.isRequired,
    ramme: PT.bool,
    ekstra: PT.bool,
    skjema: PT.bool,
    relatert: PT.bool,
    stablet: PT.bool,
    fremhevet: PT.bool,
    negativ: PT.bool,
    komprimert: PT.bool,
};

PanelBase.defaultProps = {
    className: undefined,
    ramme: false,
    ekstra: false,
    skjema: false,
    relatert: false,
    stablet: false,
    fremhevet: false,
    negativ: false,
    komprimert: false,
};

export default PanelBase;

export const Panel = (props) => <PanelBase {...props} />;
export const Rammepanel = (props) => <PanelBase ramme {...props} />;
export const Skjemapanel = (props) => <PanelBase skjema {...props} />;
export const Ekstrapanel = (props) => <PanelBase skjema {...props} />;
export const Relatertpanel = (props) => <PanelBase relatert {...props} />;
export const Stabletpanel = (props) => <PanelBase stablet {...props} />;
export const Fremhevetpanel = (props) => <PanelBase fremhevet {...props} />;
export const Negativpanel = (props) => <PanelBase negativ {...props} />;
export const Komprimertpanel = (props) => <PanelBase komprimert {...props} />;
