import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';

interface Props {
    forhaandsorienteringIkkeLagtTil: boolean;
}

const ForhaandsorienteringLagtTilInfotekst = (props: Props) => {
    const { forhaandsorienteringIkkeLagtTil } = props;

    if (forhaandsorienteringIkkeLagtTil) {
        return null;
    }

    return (
        <AlertStripeSuksess>
            Forhåndsorientering er lagt til aktiviteten. Bruker får sms eller e-post.
        </AlertStripeSuksess>
    );
};

export default ForhaandsorienteringLagtTilInfotekst;
