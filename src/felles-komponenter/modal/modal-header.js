import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Bilde from '../../felles-komponenter/bilde/bilde';
import Tilbakeknapp from '../utils/tilbakeknapp';
import hengelasSvg from '../../img/hengelas.svg';
import VisibleIfSpan from '../utils/visible-if-span';

function ModalHeader({
    tilbakeTekstId,
    normalTekstId,
    tilbakeTekstValues,
    normalTekstValues,
    className,
    visConfirmDialog,
    aktivitetErLaast,
    intl,
    ...props
}) {
    return (
        <div
            className={classNames('modal-header-wrapper', className)}
            {...props}
        >
            {/* header til slutt for å få denne sist i tabrekkefølgen */}

            <header className="modal-header">
                <span aria-live="assertive" className="kun-for-skjermleser">
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
                    <Bilde
                        className="modal-header-bilde"
                        src={hengelasSvg}
                        alt={intl.formatMessage({ id: 'hengelas-icon-alt' })}
                    />
                </VisibleIfSpan>
                {tilbakeTekstId &&
                    <Tilbakeknapp
                        tekstId={tilbakeTekstId}
                        tekstValues={tilbakeTekstValues}
                        visConfirmDialog={visConfirmDialog}
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
    tilbakeTekstId: PT.string,
    tilbakeTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    normalTekstId: PT.string,
    normalTekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    visConfirmDialog: PT.bool,
    className: PT.string,
    aktivitetErLaast: PT.bool,
    intl: intlShape.isRequired,
};

ModalHeader.defaultProps = {
    tilbakeTekstId: undefined,
    tilbakeTekstValues: undefined,
    normalTekstId: undefined,
    normalTekstValues: undefined,
    visConfirmDialog: false,
    className: undefined,
    aktivitetErLaast: false,
};

export default injectIntl(ModalHeader);
