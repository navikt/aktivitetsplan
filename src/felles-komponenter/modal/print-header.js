import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import Tilbakeknapp from '../utils/tilbakeknapp';

function PrintHeader({
    tilbakeTekstId,
    normalTekstId,
    tilbakeTekstValues,
    normalTekstValues,
    className,
    visConfirmDialog,
    children,
    ...props
}) {
    return (
        <div
            className={classNames('modal-header-wrapper', className)}
            {...props}
        >
            {/* header til slutt for å få denne sist i tabrekkefølgen */}
            <header className="modal-header print-header">
                {tilbakeTekstId &&
                    <Tilbakeknapp
                        tekstId={tilbakeTekstId}
                        tekstValues={tilbakeTekstValues}
                        visConfirmDialog={visConfirmDialog}
                    />}
                {children}
                {normalTekstId &&
                    <Normaltekst tag="h1">
                        <FormattedMessage
                            id={normalTekstId}
                            values={normalTekstValues}
                        />
                    </Normaltekst>}
            </header>
        </div>
    );
}

PrintHeader.propTypes = {
    tilbakeTekstId: PT.string,
    tilbakeTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    normalTekstId: PT.string,
    normalTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    visConfirmDialog: PT.bool,
    className: PT.string,
    children: PT.node,
};

PrintHeader.defaultProps = {
    tilbakeTekstId: undefined,
    tilbakeTekstValues: undefined,
    normalTekstId: undefined,
    normalTekstValues: undefined,
    visConfirmDialog: false,
    className: undefined,
    children: null,
};

export default injectIntl(PrintHeader);
