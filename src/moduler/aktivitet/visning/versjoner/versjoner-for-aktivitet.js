import React, { Component } from 'react';
import PT from 'prop-types';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { connect } from 'react-redux';
import { hentVersjonerForAktivtet, fjernVersjoner } from '../../aktivitet-versjoner/aktivitet-versjoner-reducer';
import * as AppPT from '../../../../proptypes';
import visibleIfHOC from '../../../../hocs/visible-if';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import { autobind } from '../../../../utils';
import VersjonInnslag from './versjoninnslag';
import { selectSorterteVersjoner, selectVersjonerStatus } from '../../aktivitet-versjoner/aktivitet-versjoner-selector';

const MAX_SIZE = 10;

class VersjonerForAktivitet extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    componentDidMount() {
        const { doFjernVersjoner, doHentVersjonerForAktivitet, aktivitet } = this.props;
        doFjernVersjoner();
        doHentVersjonerForAktivitet(aktivitet);
    }

    componentWillUnmount() {
        const { doFjernVersjoner } = this.props;
        doFjernVersjoner();
    }

    render() {
        const { avhengighet, versjoner, className } = this.props;

        const versjonerInnslag = versjoner
            .slice(0, MAX_SIZE)
            .map((versjon, index) => (
                <VersjonInnslag key={versjon.endretDato} versjon={versjon} prevVersjon={versjoner[index + 1]} />
            ));

        const versjonerInnslagUnderAccordion = (
            <Lesmerpanel className="" apneTekst="Vis mer" lukkTekst="Vis mer">
                {versjoner.slice(MAX_SIZE).map((versjon, index) => (
                    <VersjonInnslag key={versjon.endretDato} versjon={versjon} prevVersjon={versjoner[index + 1]} />
                ))}
            </Lesmerpanel>
        );

        return (
            <Innholdslaster avhengigheter={avhengighet} spinnerStorrelse="M">
                <section className={className}>
                    {versjonerInnslag}
                    <VisibleIfDiv visible={versjoner.length > MAX_SIZE}>{versjonerInnslagUnderAccordion}</VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

VersjonerForAktivitet.propTypes = {
    avhengighet: AppPT.avhengighet.isRequired,
    versjoner: AppPT.aktiviteter.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    doHentVersjonerForAktivitet: PT.func.isRequired,
    doFjernVersjoner: PT.func.isRequired,
    className: PT.string,
};

VersjonerForAktivitet.defaultProps = {
    className: '',
};

const mapStateToProps = (state) => ({
    avhengighet: selectVersjonerStatus(state),
    versjoner: selectSorterteVersjoner(state),
});

const mapDispatchToProps = (dispatch) => ({
    doHentVersjonerForAktivitet: (aktivitet) => hentVersjonerForAktivtet(aktivitet)(dispatch),
    doFjernVersjoner: () => fjernVersjoner()(dispatch),
});

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(VersjonerForAktivitet));
