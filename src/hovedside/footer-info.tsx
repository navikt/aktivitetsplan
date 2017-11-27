import * as React from 'react';
import { UndertekstBold, Undertekst } from 'nav-frontend-typografi';
import Ikon from 'nav-frontend-ikoner-assets';
import Text from '../text';

function FooterInfo() {
    return (
        <div className="footer-info">
            <Ikon
                className="footer-info__ikon"
                kind="info-sirkel-fylt"
                height="1.5rem"
                width="1.5rem"
                title="Informasjons-ikon"
                ariaLabel="Informasjons-ikon"
            />
            <UndertekstBold>
                <Text id="info.aktivitetsplan.lanseringsdato" />
            </UndertekstBold>
            <Undertekst className="footer-info__undertekst">
                <Text id="info.aktivitetsplan.lanseringsdato.undertekst" />
            </Undertekst>
        </div>
    );
}

export default FooterInfo;
