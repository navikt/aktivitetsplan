import { Alert, Link } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
    tekstId: string | undefined;
    lenkeTekstId: string;
    href: string;
    values: { antalldagerIgjen: number };
    hidden?: boolean;
}

const AdvarselMedLenkeVarsling = (props: Props) => {
    const { hidden, tekstId, lenkeTekstId, href, values } = props;

    if (hidden) {
        return null;
    }

    return (
        <Alert variant="warning" className="mb-5 mt-4">
            <FormattedMessage id={tekstId} values={values} />
            &nbsp;
            <Link href={href}>
                <FormattedMessage id={lenkeTekstId} />
            </Link>
        </Alert>
    );
};

export default AdvarselMedLenkeVarsling;
