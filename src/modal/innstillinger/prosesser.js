import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import history from '../../history';
import StartProsess from './start-prosess';

function Prosesser({ kanAvslutte, intl }) {
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
                        id: 'innstillinger.prosess.avslutt.tittel',
                    })}
                    onClick={() => history.push('/innstillinger/avslutt/')}
                />}
            <StartProsess
                className="innstillinger__prosess"
                tittel={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tittel',
                })}
                tekst={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tekst',
                })}
                knappetekst={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tittel',
                })}
                onClick={() => history.push('/innstillinger/avslutt/')}
            />
            <StartProsess
                className="innstillinger__prosess"
                tittel={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tittel',
                })}
                tekst={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tekst',
                })}
                knappetekst={intl.formatMessage({
                    id: 'innstillinger.prosess.avslutt.tittel',
                })}
                onClick={() => history.push('/innstillinger/avslutt/')}
            />
        </div>
    );
}

Prosesser.defaultProps = {
    kanAvslutte: true,
};

Prosesser.propTypes = {
    kanAvslutte: PT.bool,
    intl: intlShape.isRequired,
};

// const mapStateToProps = state => ({
//     kanAvslutte: true // state.data.avslutningStatus.data.kanAvslutte
// });

export default connect()(injectIntl(Prosesser));
