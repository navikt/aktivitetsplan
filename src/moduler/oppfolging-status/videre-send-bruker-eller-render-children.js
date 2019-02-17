import React from 'react';
import PT from 'prop-types';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper/lib/alertstripe';
import visibleIfHOC from '../../hocs/visible-if';
import { HtmlText } from '../../text';
import GodkjennVilkar from '../vilkar/godkjenn-vilkar';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';

export const Alert = visibleIfHOC(AlertStripeInfoSolid);

export function GodkjennVilkarMedVarsling({ visVilkar, brukerHarAvslatt }) {
    return (
        <div>
            <Alert
                className="feil-container"
                visible={!visVilkar && brukerHarAvslatt}
            >
                <HtmlText id="vilkar.info-avslag-vilkar" />
            </Alert>
            <GodkjennVilkar visVilkar={visVilkar} />
        </div>
    );
}

GodkjennVilkarMedVarsling.defaultProps = {
    brukerHarAvslatt: null,
};

GodkjennVilkarMedVarsling.propTypes = {
    brukerHarAvslatt: PT.bool,
    visVilkar: PT.bool.isRequired,
};

function VidereSendBrukereEllerRenderChildren(props) {
    const {
        children,
        erVeileder,
        manuell,
        vilkarMaBesvares,
        brukerHarAvslatt,
        visVilkar,
        vilkarToggletAv,
        underOppfolging,
    } = props;
    const skalVilkaarBesvares =
        vilkarMaBesvares && underOppfolging && !vilkarToggletAv;

    if (erVeileder) {
        return (
            <div>
                {children}
            </div>
        );
    } else if (manuell) {
        return <AktiverDigitalOppfolging />;
    } else if (skalVilkaarBesvares) {
        return (
            <GodkjennVilkarMedVarsling
                visVilkar={!!visVilkar}
                brukerHarAvslatt={brukerHarAvslatt}
            />
        );
    }
    return (
        <div>
            {children}
        </div>
    );
}

VidereSendBrukereEllerRenderChildren.defaultProps = {
    children: null,
    erVeileder: null,
    manuell: null,
    underOppfolging: false,
    reservasjonKRR: null,
    vilkarMaBesvares: null,
    brukerHarAvslatt: null,
    visVilkar: false,
    videreSendTilInfo: false,
};

VidereSendBrukereEllerRenderChildren.propTypes = {
    children: PT.node,
    erVeileder: PT.bool,
    visVilkar: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    underOppfolging: PT.bool,
    brukerHarAvslatt: PT.bool,
    vilkarToggletAv: PT.bool.isRequired,
};

export default VidereSendBrukereEllerRenderChildren;
