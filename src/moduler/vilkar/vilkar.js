import React from 'react';
import PT from 'prop-types';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import VilkarInnhold from './vilkar-innhold';
import VilkarHistorikk from './vilkar-historikk';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';

const ManglerVilkar = hiddenIf(() =>
    <div className="ingen-vilkar">
        <Innholdstittel className="ingen-vilkar__header">
            <FormattedMessage id="navigasjon.vilkar" />
        </Innholdstittel>
        <AlertStripeInfoSolid>
            <FormattedMessage id="vilkar.mangler" />
        </AlertStripeInfoSolid>
    </div>
);

function Vilkar({ vilkarListe, visHistorikk }) {
    const gjeldendeVilkar = vilkarListe[0];
    const resterendeVilkar = visHistorikk ? [...vilkarListe].splice(1) : [];

    return (
        <div className="vilkar">
            <ManglerVilkar hidden={gjeldendeVilkar} />
            <VilkarInnhold
                vilkar={gjeldendeVilkar}
                harHistorikk={vilkarListe.length > 0}
                hidden={!gjeldendeVilkar}
            />
            <VisibleIfDiv
                visible={visHistorikk}
                className="vilkar__historikk-container"
            >
                <hr className="vilkar__delelinje" />
                <VilkarHistorikk resterendeVilkar={resterendeVilkar} />
            </VisibleIfDiv>
        </div>
    );
}

Vilkar.propTypes = {
    vilkarListe: PT.arrayOf(AppPT.vilkar),
    visHistorikk: PT.bool,
};

Vilkar.defaultProps = {
    visHistorikk: false,
    vilkarListe: undefined,
};

export default Vilkar;
