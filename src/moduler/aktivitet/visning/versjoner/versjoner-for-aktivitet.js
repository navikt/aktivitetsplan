import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import {
    hentVersjonerForAktivtet,
    fjernVersjoner,
} from '../../aktivitet-versjoner-reducer';
import * as AppPT from '../../../../proptypes';
import visibleIfHOC from '../../../../hocs/visible-if';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../../../felles-komponenter/accordion';
import { autobind } from '../../../../utils';
import VersjonInnslag from './versjoninnslag';

const MAX_SIZE = 10;

class VersjonerForAktivitet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        autobind(this);
    }

    componentWillMount() {
        const {
            doFjernVersjoner,
            doHentVersjonerForAktivitet,
            aktivitet,
        } = this.props;
        doFjernVersjoner();
        doHentVersjonerForAktivitet(aktivitet);
    }
    componentWillUnmount() {
        this.props.doFjernVersjoner();
    }

    onClick() {
        this.setState({ apen: !this.state.apen });
    }

    render() {
        const { versjonerData, className } = this.props;
        const versjoner = versjonerData.data;

        const versjonerInnslag = versjoner
            .slice(0, MAX_SIZE)
            .map((versjon, index) =>
                <VersjonInnslag
                    key={versjon.endretDato}
                    versjon={versjon}
                    prevVersjon={versjoner[index + 1]}
                />
            );

        const versjonerInnslagUnderAccordion = (
            <Accordion
                onClick={this.onClick}
                labelId={
                    this.state.apen ? 'endringer.skjul' : 'endringer.vis-mer'
                }
            >
                {versjoner
                    .slice(MAX_SIZE)
                    .map((versjon, index) =>
                        <VersjonInnslag
                            key={versjon.endretDato}
                            versjon={versjon}
                            prevVersjon={versjoner[index + 1]}
                        />
                    )}
            </Accordion>
        );

        return (
            <Innholdslaster
                avhengigheter={[versjonerData]}
                spinnerStorrelse="m"
            >
                <section className={className}>
                    {versjonerInnslag}
                    <VisibleIfDiv visible={versjoner.length > MAX_SIZE}>
                        {versjonerInnslagUnderAccordion}
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

VersjonerForAktivitet.propTypes = {
    versjonerData: AppPT.reducerArray.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    doHentVersjonerForAktivitet: PT.func.isRequired,
    doFjernVersjoner: PT.func.isRequired,
    className: PT.string,
};

VersjonerForAktivitet.defaultProps = {
    className: '',
};

const mapStateToProps = state => ({
    versjonerData: state.data.versjoner,
});

const mapDispatchToProps = dispatch => ({
    doHentVersjonerForAktivitet: aktivitet =>
        hentVersjonerForAktivtet(aktivitet)(dispatch),
    doFjernVersjoner: () => fjernVersjoner()(dispatch),
});

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(VersjonerForAktivitet)
);
