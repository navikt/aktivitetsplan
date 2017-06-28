import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import { autobind } from '../../utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../felles-komponenter/accordion';
import OppfolgingPeriodeInnslag from './oppfolgingperiode-innslag';

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
        const { situasjon } = this.props;
        const oppfolgingsPerioder = situasjon.data.oppfolgingsPerioder || [];
        const oppfolgingsPerioderSorted = [
            ...oppfolgingsPerioder,
        ].sort((a, b) => b.sluttDato.localeCompare(a.sluttDato));

        const forstePeriode =
            oppfolgingsPerioderSorted[0] &&
            <OppfolgingPeriodeInnslag
                key={oppfolgingsPerioderSorted[0].sluttDato}
                periode={oppfolgingsPerioderSorted[0]}
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
                {oppfolgingsPerioderSorted
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
                avhengigheter={[situasjon]}
                spinnerStorrelse="m"
                className="spinner"
            >
                <section className="oppfolgingperiode__historikk">
                    <Undertittel>
                        <FormattedMessage id="innstillinger.oppfolginghistorikk.tittel" />
                    </Undertittel>
                    {forstePeriode ||
                        <FormattedMessage id="innstillinger.oppfolginghistorikk.ingenhistorikk" />}
                    <VisibleIfDiv
                        visible={oppfolgingsPerioderSorted.length > 1}
                    >
                        {restenAvPeriodene}
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

OppfolgingsperiodeHistorikk.propTypes = {
    situasjon: AppPT.situasjon.isRequired,
};

const mapStateToProps = state => ({
    situasjon: state.data.situasjon,
});

export default connect(mapStateToProps)(OppfolgingsperiodeHistorikk);
