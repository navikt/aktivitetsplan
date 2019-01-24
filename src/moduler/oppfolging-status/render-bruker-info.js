import React, { Component } from 'react';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper/lib/alertstripe';
import * as AppPT from '../../proptypes';
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

class RenderBrukerInfoHook extends Component {
    componentWillMount() {
        const { erVeileder, videreSendTilInfo, history } = this.props;
        if (!erVeileder && videreSendTilInfo) {
            history.push('/informasjon');
        }
    }

    render() {
        const {
            children,
            erVeileder,
            manuell,
            vilkarMaBesvares,
            brukerHarAvslatt,
            visVilkar,
            privateModus,
            vilkarToggletAv,
        } = this.props;
        const skalVilkaarBesvares =
            vilkarMaBesvares && !(privateModus || vilkarToggletAv);

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
}

RenderBrukerInfoHook.defaultProps = {
    children: null,
    erVeileder: null,
    manuell: null,
    underOppfolging: null,
    reservasjonKRR: null,
    vilkarMaBesvares: null,
    brukerHarAvslatt: null,
    visVilkar: false,
    videreSendTilInfo: false,
};

RenderBrukerInfoHook.propTypes = {
    children: PT.node,
    erVeileder: PT.bool,
    underOppfolging: PT.bool, // eslint-disable-line react/no-unused-prop-types
    visVilkar: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool,
    privateModus: PT.bool.isRequired,
    vilkarToggletAv: PT.bool.isRequired,
    videreSendTilInfo: PT.bool.isRequired,
    history: AppPT.history.isRequired,
};

export default withRouter(RenderBrukerInfoHook);
