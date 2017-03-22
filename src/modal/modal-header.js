import React, { PropTypes as PT } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import LukkKnapp from '../felles-komponenter/utils/lukk-knapp/lukk-knapp';
import Tilbakeknapp from '../felles-komponenter/utils/tilbakeknapp';
import './modal-header.less';

function ModalHeader({ tilbakeTekstId, normalTekstId, normalTekstValues, className, children, ...props }) {
    return (
        <div className={classNames('modal-header-wrapper', className)} {...props} >
            <div>{children}</div>
            { /* header til slutt for å få denne sist i tabrekkefølgen */ }
            <header className="modal-header">
                {tilbakeTekstId && <Tilbakeknapp /> }
                {normalTekstId && <Normaltekst><FormattedMessage id={normalTekstId} values={normalTekstValues} /></Normaltekst>}
                <i />
                <LukkKnapp />
            </header>
        </div>
    );
}

ModalHeader.propTypes = {
    tilbakeTekstId: PT.string,
    tilbakeTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    normalTekstId: PT.string,
    normalTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types

    className: PT.string,
    children: PT.node
};

export default ModalHeader;
