import { Alert, ReadMore } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { SerializedError } from '../../api/utils';
import { guid } from '../../utils/utils';
import FeilmeldingDetaljer from './FeilmeldingDetaljer';
import { getErrorText } from './GetErrorText';

interface PropTypes {
    feilmeldinger: SerializedError[];
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
