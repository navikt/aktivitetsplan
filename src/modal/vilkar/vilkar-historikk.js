import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './vilkar.less';
import * as AppPT from '../../proptypes';
import Accordion from '../../felles-komponenter/accordion';

function VilkarHistorikk({ resterendeVilkar }) {
    function historiskVilkarLink(status, dato, hash) {
        return (
            <Link to={`vilkar/${hash}`} key={hash} className="vilkar__link lenke lenke--frittstaende">
                <FormattedMessage id="vilkar.modal.gjeldende-status-dato-link" values={{ status, dato }} />
            </Link>
        );
    }

    return (
        <div className="vilkar__historikk">
            <Accordion
                labelId="vilkar.modal.vis-siste-historiske-vilkar"
                linkIBunnen
                chevronIBunnen
                linkClassName="vilkar__historikk-accordion-link"
                chevronClassName="vilkar__historikk-chevron"
            >
                {resterendeVilkar.map((vilkar) => historiskVilkarLink(vilkar.vilkarstatus, vilkar.dato, vilkar.hash))}
                {resterendeVilkar.map((vilkar) => historiskVilkarLink(vilkar.vilkarstatus, vilkar.dato, vilkar.hash))}
                {resterendeVilkar.map((vilkar) => historiskVilkarLink(vilkar.vilkarstatus, vilkar.dato, vilkar.hash))}
            </Accordion>
        </div>
    );
}

VilkarHistorikk.propTypes = {
    resterendeVilkar: PT.arrayOf(AppPT.vilkar).isRequired
};

export default VilkarHistorikk;
