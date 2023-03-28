import { Alert } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';

interface Props {
    aktivitet: AlleAktiviteter;
    nyStatus: AktivitetStatus;
    children: JSX.Element | null;
}

const PubliserReferat = ({ aktivitet, nyStatus, children }: Props) => {
    if (manglerPubliseringAvSamtaleReferat(aktivitet, nyStatus)) {
        return (
            <Alert variant="error">
                <FormattedMessage id={`aktivitetstatus.mangler-publisering-av-samtalereferat.${aktivitet.type}`} />
            </Alert>
        );
    }
    return children;
};

export default PubliserReferat;
