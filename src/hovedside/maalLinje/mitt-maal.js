import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import MalIcon from './mal-ikon';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../../moduler/mal/aktivitetsmal-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import { selectViserHistoriskPeriode } from '../../moduler/filtrering/filter/filter-selector';

function Mal({ mal, disabled }) {
    if (!mal) {
        const id = disabled ? 'aktivitetsmal.mitt-mal-disabled' : 'aktivitetsmal.mitt-mal-deafult';
        return <FormattedMessage tagName="div" id={id} />;
    }
    return (
        <i>
            <Tekstomrade>{`"${mal}"`}</Tekstomrade>
        </i>
    );
}

// This whole folder should be deleted in the future
class MittMaal extends Component {
    componentDidMount() {
        const { doHentMal } = this.props;
        doHentMal();
    }

    render() {
        const { avhengigheter, mal, underOppfolging, erVeileder, viserHistoriskPeriode } = this.props;
        const disabled = !!mal || !underOppfolging;
        const url = disabled ? '/mal' : '/mal/endre';

        if (viserHistoriskPeriode) {
            return (
                <div className="mitt-maal">
                    <MalIcon />
                    <div className="mittmal_content">
                        <Element className="mittmal__content-header">Mitt mål</Element>
                        <EtikettLiten className="hovedmaal">Målet er arkivert</EtikettLiten>
                    </div>
                </div>
            );
        }

        return (
            <InternLenke skipStyling href={url} className="mitt-maal" onClick={() => loggMittMalKlikk(erVeileder)}>
                <MalIcon />
                <div className="mittmal_content">
                    <Element className="mittmal__content-header">
                        <FormattedMessage id="aktivitetsmal.mitt-mal" />
                    </Element>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <Mal disabled={disabled} mal={mal} />
                    </Innholdslaster>
                </div>
            </InternLenke>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
    disabled: false
};

Mal.propTypes = {
    mal: PT.string,
    disabled: PT.bool
};

MittMaal.defaultProps = {
    mal: undefined,
    viserHistoriskPeriode: false
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
    underOppfolging: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired,
    viserHistoriskPeriode: PT.bool
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    underOppfolging: selectErUnderOppfolging(state),
    erVeileder: selectErVeileder(state),
    viserHistoriskPeriode: selectViserHistoriskPeriode(state)
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MittMaal);
