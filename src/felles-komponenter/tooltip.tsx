import React from 'react';
import styles from './tooltip.module.less';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    tooltip: string;
}

function Tooltip(props: Props) {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames(styles.tooltip)} aria-label={props.tooltip} {...rest}>
            {' '}
            {props.children}{' '}
            <Normaltekst aria-hidden="true" className={styles.text}>
                {props.tooltip}
            </Normaltekst>{' '}
        </div>
    );
}

export default Tooltip;
