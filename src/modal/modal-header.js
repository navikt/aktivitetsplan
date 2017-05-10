import React, { PropTypes as PT } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Bilde from 'nav-react-design/dist/bilde';
import Tilbakeknapp from '../felles-komponenter/utils/tilbakeknapp';
import './modal-header.less';
import hengelasSvg from '../img/hengelas.svg';
import VisibleIfSpan from '../felles-komponenter/utils/visible-if-span';

function ModalHeader({ tilbakeTekstId, normalTekstId, tilbakeTekstValues, normalTekstValues, className, children, visConfirmDialog, aktivitetErLaast, ...props }) {
    return (
        <div className={classNames('modal-header-wrapper', className)} {...props} >
            <div>{children}</div>
            { /* header til slutt for å få denne sist i tabrekkefølgen */ }
            <header className="modal-header">
                <VisibleIfSpan className="modal-header-skillestrek" visible={aktivitetErLaast}>
                    <Bilde className="modal-header-bilde" src={hengelasSvg} alt={props.intl.formatMessage({ id: 'hengelas-icon-alt' })} />
                </VisibleIfSpan>
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
    children: PT.node,
    aktivitetErLaast: PT.bool,
    intl: intlShape.isRequired
};

ModalHeader.defaultProps = {
    tilbakeTekstId: undefined,
    tilbakeTekstValues: undefined,
    normalTekstId: undefined,
    normalTekstValues: undefined,
    visConfirmDialog: false,
    className: undefined,
    children: undefined,
    aktivitetErLaast: false
};

export default injectIntl(ModalHeader);
