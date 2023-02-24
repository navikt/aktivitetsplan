import { Locked } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

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
        <div className={classNames('flex space-x-2', className)} {...rest}>
            {aktivitetErLaast ? (
                <div>
                    <Locked />
                    <span aria-live="assertive" className="sr-only">
                        {aktivitetErLaast ? 'Denne aktiviteten kan ikke redigeres.' : ''}
                    </span>
                </div>
            ) : null}
            {tilbakeTekst && onTilbakeClick && <Tilbakeknapp tekst={tilbakeTekst} onClick={onTilbakeClick} />}
            {headerTekst && <BodyShort>{headerTekst}</BodyShort>}
        </div>
    );
};

export default ModalHeader;
