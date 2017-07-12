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
import { settDigital } from './sett-digital-reducer';
import { STATUS } from '../../ducks/utils';
import { hentSituasjon } from '../../ducks/situasjon';

function SettDigital({
    reservertIKRR,
    doSettDigital,
    settDigitalReducer,
    intl,
}) {
    const setterDigital =
        settDigitalReducer.status === STATUS.PENDING ||
        settDigitalReducer.status === STATUS.RELOADING;
    const settDigitalFeilet = settDigitalReducer.status === STATUS.ERROR;
    return (
        <div className="sett-digital">
            <Varsling
                hidden={reservertIKRR || settDigitalFeilet}
                tekstId="sett-digital.manuell-oppfolging.infotekst"
                className="sett-digital__varsel"
            />

            <VarslingMedLenke
                hidden={!reservertIKRR || settDigitalFeilet}
                tekstId="sett-digital.reservert-i-krr.infotekst"
                lenkeTekstId="sett-digital.reservert-i-krr.lenketekst"
                href={intl.formatMessage({
                    id: 'sett-digital.reservert-i-krr.url-lenke',
                })}
                className="sett-digital__varsel"
            />

            <AdvarselVarsling
                hidden={!settDigitalFeilet}
                tekstId="sett-digital.feilmelding"
                className="sett-digital__varsel"
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

SettDigital.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    doSettDigital: PT.func.isRequired,
    settDigitalReducer: AppPT.reducer.isRequired,
    intl: intlShape.isRequired,
};

const mapStateToProps = state => ({
    reservertIKRR: state.data.situasjon.data.reservasjonKRR,
    settDigitalReducer: state.data.settDigital,
});

const mapDispatchToProps = dispatch => ({
    doSettDigital: () =>
        dispatch(settDigital()).then(dispatch(hentSituasjon())),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(SettDigital)
);
