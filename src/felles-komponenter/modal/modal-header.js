import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Tilbakeknapp from './tilbakeknapp';
import HengeLasIkon from './hengelas-ikon';
import VisibleIfSpan from '../utils/visible-if-span';

function ModalHeader({
    tilbakeTekst,
    normalTekstId,
    normalTekstValues,
    className,
    onTilbakeClick,
    aktivitetErLaast,
    intl,
    ...props
}) {
    return (
        <div
            className={classNames('modal-header-wrapper', className)}
            {...props}
        >
            <header className="modal-header">
                <span aria-live="assertive" className="sr-only">
                    {aktivitetErLaast
                        ? intl.formatMessage({
                              id: 'aktivitetsmodal.kan.ikke.redigeres',
                          })
                        : ''}
                </span>
                <VisibleIfSpan
                    className="modal-header-skillestrek"
                    visible={aktivitetErLaast}
                >
                    <HengeLasIkon />
                </VisibleIfSpan>
                {tilbakeTekst &&
                    <Tilbakeknapp
                        tekst={tilbakeTekst}
                        onClick={onTilbakeClick}
                    />}
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

ModalHeader.propTypes = {
    tilbakeTekst: PT.string,
    normalTekstId: PT.string,
    normalTekstValues: PT.object,
    onTilbakeClick: PT.func,
    className: PT.string,
    aktivitetErLaast: PT.bool,
    intl: intlShape.isRequired,
};

ModalHeader.defaultProps = {
    tilbakeTekst: undefined,
    normalTekstId: undefined,
    normalTekstValues: undefined,
    onTilbakeClick: undefined,
    className: undefined,
    aktivitetErLaast: false,
};

export default injectIntl(ModalHeader);
