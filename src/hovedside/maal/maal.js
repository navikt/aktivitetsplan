import React, { Component } from 'react';
import { Normaltekst, Element, EtikettLiten } from 'nav-frontend-typografi';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import {
    hentFremtidigSituasjon,
    selectFremtidigSituasjonData,
    selectFremtidigSituasjonStatus,
} from './fremtidigSituasjon-reducer';
import * as AppPT from '../../proptypes';
import './maal.less';
import { selectViserHistoriskPeriode } from '../../moduler/filtrering/filter/filter-selector';

const REGISTRERINGSINFO_URL = '/registreringsinformasjon?modus=rediger';

function InnerMaalInfo({ fremtidigSituasjonTekst, mal, arkivert }) {
    if (arkivert) {
        return (
            <EtikettLiten className="hovedmaal">Målet er arkivert</EtikettLiten>
        );
    }
    return (
        <div className="maal__inner">
            <EtikettLiten className="hovedmaal">
                {fremtidigSituasjonTekst || ''}
            </EtikettLiten>
            <Normaltekst>
                {mal || ''}
            </Normaltekst>
            <a
                href={REGISTRERINGSINFO_URL}
                className="typo-element lenke mal-endre-knapp"
            >
                {fremtidigSituasjonTekst && mal ? 'Endre' : 'Legg til'}
            </a>
        </div>
    );
}

InnerMaalInfo.propTypes = {
    fremtidigSituasjonTekst: PT.string,
    mal: PT.string,
    arkivert: PT.bool,
};

InnerMaalInfo.defaultProps = {
    mal: undefined,
    fremtidigSituasjonTekst: undefined,
    arkivert: false,
};

class Maal extends Component {
    componentDidMount() {
        const { doHentMal, doHentFremtidigSituasjon } = this.props;
        doHentMal();
        doHentFremtidigSituasjon();
    }

    render() {
        const {
            avhengigheter,
            underOppfolging,
            mal,
            fremtidigSituasjonTekst,
            viserHistoriskPeriode,
        } = this.props;
        if (!underOppfolging) {
            return null;
        }
        return (
            <div className="maal">
                <Innholdslaster avhengigheter={avhengigheter}>
                    <Element>Mål</Element>
                    <InnerMaalInfo
                        fremtidigSituasjonTekst={fremtidigSituasjonTekst}
                        mal={mal}
                        arkivert={viserHistoriskPeriode}
                    />
                </Innholdslaster>
            </div>
        );
    }
}

Maal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    doHentMal: PT.func.isRequired,
    doHentFremtidigSituasjon: PT.func.isRequired,
    underOppfolging: PT.bool.isRequired,
    fremtidigSituasjonTekst: PT.string,
    mal: PT.string,
    viserHistoriskPeriode: PT.bool,
};

Maal.defaultProps = {
    mal: undefined,
    fremtidigSituasjonTekst: undefined,
    viserHistoriskPeriode: false,
};

const mapStateToProps = state => ({
    avhengigheter: [
        selectMalStatus(state),
        selectFremtidigSituasjonStatus(state),
    ],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    fremtidigSituasjonTekst: selectFremtidigSituasjonData(state).tekst,
    underOppfolging: selectErUnderOppfolging(state),
    viserHistoriskPeriode: selectViserHistoriskPeriode(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
    doHentFremtidigSituasjon: () => dispatch(hentFremtidigSituasjon()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Maal);
