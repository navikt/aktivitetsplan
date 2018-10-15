import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { VisibleIfLesmerpanel } from '../../felles-komponenter/utils/visible-if-lesmerpanel';
import AktivitetsKort from '../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import VisibleIfSpan from '../../felles-komponenter/utils/visible-if-span';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

class SkjulEldreAktiviteter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visIntroTeksten: true,
        };
        this.toggle = this.toggle.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    toggle(event) {
        this.setState({ visIntroTeksten: !this.state.visIntroTeksten });
    }

    render() {
        const logging = (typeEvent, erVeileder) => {
            const frontendlogger = window.frontendlogger;
            if (frontendlogger) {
                frontendlogger.event(typeEvent, { erVeileder }, {});
            }
        };

        const introKomponent = (
            <FormattedMessage id="vis-eldre-aktiviteter-intro">
                {tekst =>
                    <VisibleIfSpan visible={this.state.visIntroTeksten}>
                        {tekst}
                    </VisibleIfSpan>}
            </FormattedMessage>
        );
        return (
            <VisibleIfLesmerpanel
                visible={
                    this.props.aktivitetTilDatoMerEnnToManederSiden.length > 0
                }
                className="aktivitetstavle__kolonne-lesmerpanel"
                onOpen={event => {
                    this.toggle(event);
                    logging(
                        LOGGING_VISELDREAKITIVITETER,
                        this.props.erVeileder
                    );
                }}
                onClose={event => {
                    this.toggle(event);
                    logging(
                        LOGGING_SKJULELDREAKTIVITETER,
                        this.props.erVeileder
                    );
                }}
                intro={introKomponent}
                apneTekst={this.props.intl.formatMessage({
                    id: 'vis-eldre-aktiviteter-apnetekst',
                })}
                lukkTekst={this.props.intl.formatMessage({
                    id: 'vis-eldre-aktiviteter-lukktekst',
                })}
            >
                {this.props.aktivitetTilDatoMerEnnToManederSiden.map(
                    aktivitet =>
                        <AktivitetsKort
                            key={aktivitet.id}
                            aktivitet={aktivitet}
                        />
                )}
            </VisibleIfLesmerpanel>
        );
    }
}

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
});

SkjulEldreAktiviteter.propTypes = {
    aktivitetTilDatoMerEnnToManederSiden: PT.arrayOf(PT.object).isRequired,
    erVeileder: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(connect(mapStateToProps)(SkjulEldreAktiviteter));
