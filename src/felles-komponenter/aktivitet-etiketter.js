import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import * as AppPT from '../proptypes';
import './aktivitet-etiketter.less';

const cls = (type) => classNames('etikett', `etikett--${type}`);
const etikettCls = (className) => classNames(className, 'etiketter');
function AktivitetEtikett({ etiketter, className }) {
    const etikettVisning = (taggs) => taggs.map((tag) => (
        <span key={tag.tag} className={cls(tag.type)}>
            {tag.tag}
        </span>
    ));

    return (
        <div className={etikettCls(className)}>{ etiketter ? etikettVisning(etiketter) : null }</div>
    );
}

AktivitetEtikett.propTypes = {
    etiketter: PT.arrayOf(AppPT.etikett).isRequired,
    className: PT.string
};

export default AktivitetEtikett;
