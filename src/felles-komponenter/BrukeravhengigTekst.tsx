import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { selectErBruker } from '../moduler/identitet/identitet-selector';

interface Props {
    id: string;
    endretAv?: string;
}

const BrukeravhengigTekst = (props: Props) => {
    const { id, endretAv } = props;

    const erBruker = useSelector(selectErBruker);

    const postFix = erBruker ? 'bruker' : 'veileder';
    const labelId = `${id}.${postFix}`;

    return <FormattedMessage id={labelId} values={{ endretAv }} />;
};

export default BrukeravhengigTekst;
