import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import history from '../../history';
import StartProsess from './start-prosess';

function Prosesser({ kanAvslutte, kanStarte, intl }) {
    return (
        <div>
            {kanAvslutte &&
                <StartProsess
                    className="innstillinger__prosess"
                    tittel={intl.formatMessage({
                        id: 'innstillinger.prosess.avslutt.tittel',
                    })}
                    tekst={intl.formatMessage({
                        id: 'innstillinger.prosess.avslutt.tekst',
                    })}
                    knappetekst={intl.formatMessage({
                        id: 'innstillinger.modal.prosess.start.knapp',
                    })}
                    onClick={() => history.push('/innstillinger/avslutt/')}
                />}
            {kanStarte &&
                <StartProsess
                    className="innstillinger__prosess"
                    tittel={intl.formatMessage({
                        id: 'innstillinger.prosess.startoppfolging.tittel',
                    })}
                    tekst={intl.formatMessage({
                        id: 'innstillinger.prosess.startoppfolging.tekst',
                    })}
                    knappetekst={intl.formatMessage({
                        id: 'innstillinger.modal.prosess.start.knapp',
                    })}
                    onClick={() =>
                        history.push('/innstillinger/start/bekreft/')}
                />}
        </div>
    );
}

Prosesser.defaultProps = {
    kanAvslutte: true,
    kanStarte: false,
};

Prosesser.propTypes = {
    kanAvslutte: PT.bool,
    kanStarte: PT.bool,
    intl: intlShape.isRequired,
};

const mapStateToProps = state => ({
    // TODO: må hente avslutningStatus
    // kanAvslutte: true // state.data.avslutningStatus.data.kanAvslutte
    kanStarte: state.data.oppfolgingStatus.data.kanStarteOppfolging,
});

export default connect(mapStateToProps)(injectIntl(Prosesser));
