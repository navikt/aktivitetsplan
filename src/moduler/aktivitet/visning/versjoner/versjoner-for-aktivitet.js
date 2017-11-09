import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import {
    hentVersjonerForAktivtet,
    fjernVersjoner,
} from '../../aktivitet-versjoner/aktivitet-versjoner-reducer';
import * as AppPT from '../../../../proptypes';
import visibleIfHOC from '../../../../hocs/visible-if';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../../../felles-komponenter/accordion';
import { autobind } from '../../../../utils';
import VersjonInnslag from './versjoninnslag';
import {
    selectSorterteVersjoner,
    selectVersjonerStatus,
} from '../../aktivitet-versjoner/aktivitet-versjoner-selector';

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
        const { avhengighet, versjoner, className } = this.props;

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
            <Innholdslaster avhengigheter={avhengighet} spinnerStorrelse="m">
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
    avhengighet: AppPT.avhengighet.isRequired,
    versjoner: AppPT.reducerArray.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    doHentVersjonerForAktivitet: PT.func.isRequired,
    doFjernVersjoner: PT.func.isRequired,
    className: PT.string,
};

VersjonerForAktivitet.defaultProps = {
    className: '',
};

const mapStateToProps = state => ({
    avhengighet: selectVersjonerStatus(state),
    versjoner: selectSorterteVersjoner(state),
});

const mapDispatchToProps = dispatch => ({
    doHentVersjonerForAktivitet: aktivitet =>
        hentVersjonerForAktivtet(aktivitet)(dispatch),
    doFjernVersjoner: () => fjernVersjoner()(dispatch),
});

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(VersjonerForAktivitet)
);
