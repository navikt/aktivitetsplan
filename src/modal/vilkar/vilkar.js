import React from 'react';
import { FormattedMessage } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import { Innholdstittel } from 'nav-frontend-typografi';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import vilkarSvg from './vilkar-illustrasjon.svg';
import './vilkar.less';
import * as AppPT from '../../proptypes';

function Vilkar({ historiskeVilkarListe }) {
    return (
        <div className="vilkar">
            <div className="vilkar__innhold">
                <Bilde src={vilkarSvg} alt="Dekorativ illustrajon" />
                <Innholdstittel className="vilkar__tittel"><FormattedMessage id="vilkar.tittel" /></Innholdstittel>
                <UnsafeHtml className="vilkar__tekst">{historiskeVilkarListe[0].tekst}</UnsafeHtml>
            </div>
        </div>
    );
}

Vilkar.propTypes = {
    historiskeVilkarListe: AppPT.vilkar.isRequired
};

export default Vilkar;
