import React, { PropTypes as PT } from 'react';
import { Normaltekst } from 'nav-react-design/dist/typografi';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import OppfolgingStatus from '../sider/oppfolging/oppfolging-status';
import LukkKnapp from './lukk-knapp';
import Tilbakeknapp from './tilbakeknapp';

function ModalHeader({ tilbakeTekstId, tilbakeTekstValues, normalTekstId, normalTekstValues, visVilkar, className, children, ...props }) {
    return (
        <div className={classNames('modal-header-wrapper', className)} {...props} >
            <OppfolgingStatus visVilkar={visVilkar}>{children}</OppfolgingStatus>
            { /* header til slutt for å få denne sist i tabrekkefølgen */ }
            <header className="modal-header">
                {tilbakeTekstId && <Tilbakeknapp ><FormattedMessage id={tilbakeTekstId} values={tilbakeTekstValues} /></Tilbakeknapp> }
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

    visVilkar: PT.bool,
    className: PT.string,
    children: PT.node
};

export default ModalHeader;
