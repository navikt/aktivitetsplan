import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import {
    AdvarselVarsling,
    Varsling,
    VarslingMedLenke,
} from '../varslinger/varsel-alertstriper';
import * as AppPT from '../../proptypes';
import { settDigital } from './aktiver-digital-oppfolging-reducer';
import { STATUS } from '../../ducks/utils';
import { hentSituasjon } from '../../ducks/situasjon';

function AktiverDigitalOppfolgingVarselPure({
    reservertIKRR,
    aktiverDigitalOppfolgingFeilet,
    intl,
}) {
    if (reservertIKRR || aktiverDigitalOppfolgingFeilet) {
        return (
            <Varsling
                tekstId="sett-digital.manuell-oppfolging.infotekst"
                className="sett-digital__varsel"
            />
        );
    } else if (!reservertIKRR || aktiverDigitalOppfolgingFeilet) {
        return (
            <VarslingMedLenke
                tekstId="sett-digital.reservert-i-krr.infotekst"
                lenkeTekstId="sett-digital.reservert-i-krr.lenketekst"
                href={intl.formatMessage({
                    id: 'sett-digital.reservert-i-krr.url-lenke',
                })}
                className="sett-digital__varsel"
            />
        );
    } else if (!aktiverDigitalOppfolgingFeilet) {
        return (
            <AdvarselVarsling
                tekstId="sett-digital.feilmelding"
                className="sett-digital__varsel"
            />
        );
    }
}

AktiverDigitalOppfolgingVarselPure.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    aktiverDigitalOppfolgingFeilet: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

const AktiverDigitalOppfolgingVarsel = injectIntl(
    AktiverDigitalOppfolgingVarselPure
);

function AktiverDigitalOppfolging({
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
                aktiverDigitalOppfolgingFeilet={
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

AktiverDigitalOppfolging.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    doSettDigital: PT.func.isRequired,
    aktiverDigitalOppfolgingReducer: AppPT.reducer.isRequired,
};

const mapStateToProps = state => ({
    reservertIKRR: state.data.situasjon.data.reservasjonKRR,
    aktiverDigitalOppfolgingReducer: state.data.aktiverDigitalOppfolging,
});

const mapDispatchToProps = dispatch => ({
    doSettDigital: () =>
        dispatch(settDigital()).then(dispatch(hentSituasjon())),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktiverDigitalOppfolging
);
