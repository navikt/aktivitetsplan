import React from 'react';
import PT from 'prop-types';
import './vilkar.less';
import * as AppPT from '../../proptypes';
import VilkarInnhold from './vilkar-innhold';
import VilkarHistorikk from './vilkar-historikk';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function Vilkar({ vilkarListe, vilkar, visHistorikk }) {
    const gjeldendeVilkar = visHistorikk ? vilkarListe[0] : vilkar;
    const resterendeVilkar = visHistorikk && [...vilkarListe].splice(1);

    return (
        <div className="vilkar">
            <VilkarInnhold vilkar={gjeldendeVilkar} />
            <VisibleIfDiv visible={visHistorikk} className="vilkar__historikk-container">
                <hr className="vilkar__delelinje" />
                <VilkarHistorikk resterendeVilkar={resterendeVilkar} />
            </VisibleIfDiv>
        </div>
    );
}

Vilkar.propTypes = {
    vilkarListe: PT.arrayOf(AppPT.vilkar),
    vilkar: AppPT.vilkar,
    visHistorikk: PT.bool
};

Vilkar.defaultProps = {
    visHistorikk: false,
    vilkarListe: undefined,
    vilkar: undefined
};

export default Vilkar;
