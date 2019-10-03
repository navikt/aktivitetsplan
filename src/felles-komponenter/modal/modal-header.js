import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';
import Tilbakeknapp from './tilbakeknapp';
import HengeLasIkon from './hengelas-ikon';
import VisibleIfSpan from '../utils/visible-if-span';

function ModalHeader({ tilbakeTekst, headerTekst, className, onTilbakeClick, aktivitetErLaast, ...props }) {
    return (
        <div className={classNames('modal-header-wrapper', className)} {...props}>
            <header className="modal-header">
                <span aria-live="assertive" className="sr-only">
                    {aktivitetErLaast ? 'Denne aktiviteten kan ikke redigeres.' : ''}
                </span>
                <VisibleIfSpan className="modal-header-skillestrek" visible={aktivitetErLaast}>
                    <HengeLasIkon />
                </VisibleIfSpan>
                {tilbakeTekst && <Tilbakeknapp tekst={tilbakeTekst} onClick={onTilbakeClick} />}
                {headerTekst && <Normaltekst tag="h1">{headerTekst}</Normaltekst>}
            </header>
        </div>
    );
}

ModalHeader.propTypes = {
    tilbakeTekst: PT.string,
    headerTekst: PT.string,
    onTilbakeClick: PT.func,
    className: PT.string,
    aktivitetErLaast: PT.bool
};

ModalHeader.defaultProps = {
    tilbakeTekst: undefined,
    headerTekst: undefined,
    onTilbakeClick: undefined,
    className: undefined,
    aktivitetErLaast: false
};

export default ModalHeader;
