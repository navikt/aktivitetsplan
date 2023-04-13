import { Alert, ReadMore } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { guid } from '../../utils/utils';
import FeilmeldingDetaljer from './FeilmeldingDetaljer';
import { FeilmeldingType } from './FeilmeldingTypes';
import { getErrorText } from './GetErrorText';

interface PropTypes {
    feilmeldinger: FeilmeldingType[];
}

export default function Feilmelding(props: PropTypes) {
    const { feilmeldinger } = props;

    if (feilmeldinger.length === 0) {
        return null;
    }

    const tekst = getErrorText(feilmeldinger);

    return (
        <div className={classNames('m-4')}>
            <Alert variant="error">{tekst}</Alert>

            <ReadMore className="mt-2 " header={'Vis detaljer'}>
                {feilmeldinger.map((feil) => (
                    <FeilmeldingDetaljer feil={feil} key={guid()} />
                ))}
            </ReadMore>
        </div>
    );
}
