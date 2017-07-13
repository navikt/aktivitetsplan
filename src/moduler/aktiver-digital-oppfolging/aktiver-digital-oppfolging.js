import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import {
    AdvarselVarsling,
    Varsling,
    VarslingMedLenke,
} from '../varslinger/varsel-alertstriper';
import * as AppPT from '../../proptypes';
import { settDigital } from './aktiver-digital-oppfolging-reducer';
import { STATUS } from '../../ducks/utils';

export function AktiverDigitalOppfolgingVarsel({
    reservertIKRR,
    settDigitalFeilet,
}) {
    if (!reservertIKRR && !settDigitalFeilet) {
        return (
            <Varsling
                tekstId="sett-digital.manuell-oppfolging.infotekst"
                className="sett-digital__varsel"
            />
        );
    } else if (reservertIKRR && !settDigitalFeilet) {
        return (
            <FormattedMessage id="sett-digital.reservert-i-krr.url-lenke">
                {url =>
                    <VarslingMedLenke
                        tekstId="sett-digital.reservert-i-krr.infotekst"
                        lenkeTekstId="sett-digital.reservert-i-krr.lenketekst"
                        href={url}
                        className="sett-digital__varsel"
                    />}
            </FormattedMessage>
        );
    } else if (settDigitalFeilet) {
        return (
            <AdvarselVarsling
                tekstId="sett-digital.feilmelding"
                className="sett-digital__varsel"
            />
        );
    }
}

AktiverDigitalOppfolgingVarsel.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    settDigitalFeilet: PT.bool.isRequired,
};

export function AktiverDigitalOppfolging({
    reservertIKRR,
    doSettDigital,
    aktiverDigitalOppfolgingReducer,
}) {
    const setterDigital =
        aktiverDigitalOppfolgingReducer.status === STATUS.PENDING ||
        aktiverDigitalOppfolgingReducer.status === STATUS.RELOADING;

    return (
        <div className="sett-digital">
            <AktiverDigitalOppfolgingVarsel
                reservertIKRR={reservertIKRR}
                settDigitalFeilet={
                    aktiverDigitalOppfolgingReducer.status === STATUS.ERROR
                }
            />

            <Hovedknapp
                mini
                spinner={setterDigital}
                disabled={setterDigital}
                onClick={doSettDigital}
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.aktiver-digital-knapp" />
            </Hovedknapp>
        </div>
    );
}

AktiverDigitalOppfolging.defaultProps = {
    doSettDigital: undefined,
    aktiverDigitalOppfolgingReducer: {},
};

AktiverDigitalOppfolging.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    doSettDigital: PT.func,
    aktiverDigitalOppfolgingReducer: AppPT.reducer,
};

const mapStateToProps = state => ({
    reservertIKRR: state.data.situasjon.data.reservasjonKRR,
    aktiverDigitalOppfolgingReducer: state.data.aktiverDigitalOppfolging,
});

const mapDispatchToProps = dispatch => ({
    doSettDigital: () => dispatch(settDigital()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktiverDigitalOppfolging
);
