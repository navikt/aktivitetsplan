import { BodyShort, Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import VisibleIfSpan from '../utils/visible-if-span';
import HengeLasIkon from './HengelaasIkon';
import Tilbakeknapp from './Tilbakeknapp';

interface Props {
    tilbakeTekst?: string;
    headerTekst?: string;
    onTilbakeClick?(): string;
    className?: string;
    aktivitetErLaast?: boolean;
}

const ModalHeader = (props: Props) => {
    const { tilbakeTekst, headerTekst, className, onTilbakeClick, aktivitetErLaast = false, ...rest } = props;

    return (
        <div className={classNames('modal-header-wrapper', className)} {...rest}>
            <span aria-live="assertive" className="sr-only">
                {aktivitetErLaast ? 'Denne aktiviteten kan ikke redigeres.' : ''}
            </span>
            <VisibleIfSpan className="modal-header-skillestrek" visible={aktivitetErLaast}>
                <HengeLasIkon />
            </VisibleIfSpan>
            {tilbakeTekst && onTilbakeClick && <Tilbakeknapp tekst={tilbakeTekst} onClick={onTilbakeClick} />}
            {headerTekst && (
                <Heading level="2" size="medium">
                    {headerTekst}
                </Heading>
            )}
        </div>
    );
};

export default ModalHeader;
