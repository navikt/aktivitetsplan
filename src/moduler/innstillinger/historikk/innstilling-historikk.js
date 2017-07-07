import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import * as AppPT from '../../../proptypes';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { autobind } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../../felles-komponenter/accordion';
import InnstillingHistorikkInnslag from './innstilling-historikk-innslag';
import { hentInnstillingHistorikk } from './historikk-reducer';

class InnstillingHistorikk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        autobind(this);
    }

    componentWillMount() {
        this.props.doHentInnstillingHistorikk();
    }

    onClick() {
        this.setState({ apen: !this.state.apen });
    }

    render() {
        const { historikkReducer } = this.props;
        const historikkListeSorted = [...historikkReducer.data].sort((a, b) =>
            b.dato.localeCompare(a.dato)
        );

        const forstePeriode =
            historikkListeSorted[0] &&
            <InnstillingHistorikkInnslag
                key={historikkListeSorted[0].dato}
                manuellHistorikk={historikkListeSorted[0]}
            />;

        const restenAvPeriodene = (
            <Accordion
                onClick={this.onClick}
                labelId={
                    this.state.apen
                        ? 'innstillinger.historikk.vis-mindre'
                        : 'innstillinger.historikk.vis-mer'
                }
            >
                {historikkListeSorted
                    .slice(1)
                    .map(innslag =>
                        <InnstillingHistorikkInnslag
                            key={innslag.dato}
                            manuellHistorikk={innslag}
                        />
                    )}
            </Accordion>
        );

        return (
            <Innholdslaster
                avhengigheter={[historikkReducer]}
                spinnerStorrelse="m"
                className="innstillinger-spinner"
            >
                <section className="innstillinger__prosess">
                    <Undertittel>
                        <FormattedMessage id="innstillinger.historikk.tittel" />
                    </Undertittel>
                    {forstePeriode ||
                        <FormattedMessage id="innstillinger.historikk.ingenhistorikk" />}
                    <VisibleIfDiv visible={historikkListeSorted.length > 1}>
                        {restenAvPeriodene}
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

InnstillingHistorikk.defaultProps = {
    historikk: [],
};

InnstillingHistorikk.propTypes = {
    historikkReducer: AppPT.reducer.isRequired,
    doHentInnstillingHistorikk: PT.func.isRequired,
};

const mapStateToProps = state => ({
    historikkReducer: state.data.historikk,
});

const mapDispatchToProps = dispatch => ({
    doHentInnstillingHistorikk: () => dispatch(hentInnstillingHistorikk()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    InnstillingHistorikk
);
