import React, {Component} from 'react';
import {
    Normaltekst,
    Element,
    EtikettLiten
} from 'nav-frontend-typografi';
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

const REGISTRERINGSINFO_URL = '/registreringsinformasjon';
function VisKnappMaal({fremtidigSituasjonTekst, mal}) {
    return (
        <a
            href={REGISTRERINGSINFO_URL}
            className="typo-element lenke lenke-knapp"
        >
            {
                (fremtidigSituasjonTekst && mal)
                    ? 'Endre'
                    : 'Legg til'
            }
        </a>
    )
}

class Maal extends Component {
    componentDidMount() {
        this.props.doHentMal();
        this.props.doHentFremtidigSituasjon();
    }

    render() {
        const {
            avhengigheter,
            underOppfolging,
            mal,
            fremtidigSituasjonTekst
        } = this.props;
        if (!underOppfolging) {
            return null;
        }
        return (
            <div className="maal">
                <Innholdslaster avhengigheter={avhengigheter}>
                    <Element>Mål</Element>
                    <EtikettLiten>{fremtidigSituasjonTekst ? fremtidigSituasjonTekst : ''}</EtikettLiten>
                    <Normaltekst>{mal ? mal : ''}</Normaltekst>
                    <VisKnappMaal fremtidigSituasjonTekst={fremtidigSituasjonTekst} mal={mal}/>
                </Innholdslaster>
            </div>
        );
    }
}

Maal.defaultProps = {
    mal: undefined,
    fremtidigSituasjonTekst: undefined,
};

Maal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    fremtidigSituasjonTekst: PT.string,
    doHentMal: PT.func.isRequired,
    doHentFremtidigSituasjon: PT.func.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = state => ({
        avhengigheter: [selectMalStatus(state), selectFremtidigSituasjonStatus(state)],
        mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
        fremtidigSituasjonTekst: selectFremtidigSituasjonData(state).tekst,
        underOppfolging: selectErUnderOppfolging(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
    doHentFremtidigSituasjon: () => dispatch(hentFremtidigSituasjon()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Maal);
