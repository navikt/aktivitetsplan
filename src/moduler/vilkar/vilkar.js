import React from 'react';
import PT from 'prop-types';
import * as AppPT from '../../proptypes';
import VilkarInnhold from './vilkar-innhold';
import VilkarHistorikk from './vilkar-historikk';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function Vilkar({ vilkarListe, visHistorikk }) {
    const gjeldendeVilkar = vilkarListe[0];
    const resterendeVilkar = visHistorikk ? [...vilkarListe].splice(1) : [];

    return (
        <div className="vilkar">
            <VilkarInnhold vilkar={gjeldendeVilkar} hidden={!gjeldendeVilkar} />
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
