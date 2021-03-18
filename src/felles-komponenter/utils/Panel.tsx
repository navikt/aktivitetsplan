import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
    className?: string;
    children: ReactNode;
    ramme?: boolean;
    ekstra?: boolean;
    skjema?: boolean;
    relatert?: boolean;
    stablet?: boolean;
    fremhevet?: boolean;
    negativ?: boolean;
    komprimert?: boolean;
}

const cls = (props: Props, className?: string) =>
    classNames('panel', className, {
        'panel-ramme': props.ramme,
        'panel-ekstra': props.ekstra || props.skjema,
        'panel-relatert': props.relatert,
        'panel-stablet': props.stablet,
        'panel-fremhevet': props.fremhevet,
        'panel-negativ': props.negativ,
        'panel-komprimert': props.komprimert,
    });

const PanelBase = (props: Props) => {
    const { className, children, ...rest } = props;

    return (
        <div className={cls(props, className)} {...rest}>
            {children}
        </div>
    );
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

export const Skjemapanel = (props: Props) => <PanelBase className={props.className} {...props} skjema />;
