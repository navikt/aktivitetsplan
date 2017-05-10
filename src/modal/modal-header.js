import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Tilbakeknapp from '../felles-komponenter/utils/tilbakeknapp';
import './modal-header.less';

function ModalHeader({ tilbakeTekstId, normalTekstId, tilbakeTekstValues, normalTekstValues, className, children, visConfirmDialog, ...props }) {
    return (
        <div className={classNames('modal-header-wrapper', className)} {...props} >
            <div>{children}</div>
            { /* header til slutt for å få denne sist i tabrekkefølgen */ }
            <header className="modal-header">
                {tilbakeTekstId && <Tilbakeknapp tekstId={tilbakeTekstId} tekstValues={tilbakeTekstValues} visConfirmDialog={visConfirmDialog} /> }
                {normalTekstId && <Normaltekst><FormattedMessage id={normalTekstId} values={normalTekstValues} /></Normaltekst>}
            </header>
        </div>
    );
}

ModalHeader.propTypes = {
    tilbakeTekstId: PT.string,
    tilbakeTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    normalTekstId: PT.string,
    normalTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    visConfirmDialog: PT.bool,
    className: PT.string,
    children: PT.node
};

ModalHeader.defaultProps = {
    tilbakeTekstId: undefined,
    tilbakeTekstValues: undefined,
    normalTekstId: undefined,
    normalTekstValues: undefined,
    visConfirmDialog: false,
    className: undefined,
    children: undefined
};

export default ModalHeader;
