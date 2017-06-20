import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import { autobind } from '../../utils';
import Dato from '../../felles-komponenter/dato';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../felles-komponenter/accordion';

function OppfolgingPeriodeInnslag({ periode }) {
    const { veileder, begrunnelse, sluttDato } = periode;
    return (
        <p className="oppfolgingperiode__innslag">
            <b>
                <FormattedMessage
                    id="innstillinger.oppfolginghistorikk.beskrivelse"
                    values={{ veileder }}
                />
            </b>
            <br />
            <FormattedMessage
                id="innstillinger.oppfolginghistorikk.begrunnelse"
                values={{ begrunnelse }}
            />
            <br />
            <Dato>
                {sluttDato}
            </Dato>
        </p>
    );
}

OppfolgingPeriodeInnslag.propTypes = {
    periode: PT.shape({
        veileder: PT.string,
        begrunnelse: PT.string,
        sluttDato: PT.string,
    }).isRequired,
};

class OppfolgingsperiodeHistorikk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        autobind(this);
    }

    onClick() {
        this.setState({ apen: !this.state.apen });
    }

    render() {
        const { oppfolgingStatus } = this.props;
        const oppfolgingsPerioder = oppfolgingStatus.data
            .oppfolgingsPerioder || [];

        const forstePeriode =
            oppfolgingsPerioder[0] &&
            <OppfolgingPeriodeInnslag
                key={oppfolgingsPerioder[0].sluttDato}
                periode={oppfolgingsPerioder[0]}
            />;

        const restenAvPeriodene = (
            <Accordion
                onClick={this.onClick}
                labelId={
                    this.state.apen
                        ? 'innstillinger.oppfolginghistorikk.vis-mindre'
                        : 'innstillinger.oppfolginghistorikk.vis-mer'
                }
            >
                {oppfolgingsPerioder
                    .slice(1)
                    .map(periode => (
                        <OppfolgingPeriodeInnslag
                            key={periode.sluttDato}
                            periode={periode}
                        />
                    ))}
            </Accordion>
        );

        return (
            <Innholdslaster
                avhengigheter={[oppfolgingStatus]}
                spinnerStorrelse="m"
                className="spinner"
            >
                <section className="oppfolgingperiode__historikk">
                    <h3>
                        <FormattedMessage id="innstillinger.oppfolginghistorikk.tittel" />
                    </h3>
                    {forstePeriode ||
                        <FormattedMessage id="innstillinger.oppfolginghistorikk.ingenhistorikk" />}
                    <VisibleIfDiv visible={oppfolgingsPerioder.length > 1}>
                        {restenAvPeriodene}
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

OppfolgingsperiodeHistorikk.propTypes = {
    oppfolgingStatus: AppPT.reducer.isRequired,
};

const mapStateToProps = state => ({
    oppfolgingStatus: state.data.oppfolgingStatus,
});

export default connect(mapStateToProps)(OppfolgingsperiodeHistorikk);
