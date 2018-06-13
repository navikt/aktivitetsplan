import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import mittMalSvg from './Illustrasjon_dette_gjor_du_bra.svg';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErBruker } from '../../moduler/identitet/identitet-selector';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { selectViserInneverendePeriode } from '../../moduler/filtrering/filter/filter-selector';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

function Mal({ mal, privatModus }) {
    if (!mal || privatModus) {
        return (
            <FormattedMessage
                tagName="div"
                id={'aktivitetsmal.mitt-mal-deafult'}
            />
        );
    }
    return (
        <i>
            <Tekstomrade>
                {`"${mal}"`}
            </Tekstomrade>
        </i>
    );
}

class MittMaal extends Component {
    componentDidMount() {
        this.props.doHentMal();
    }

    render() {
        const { avhengigheter, mal, privatModus } = this.props;
        const url = mal ? '/mal' : '/mal/endre';

        return (
            <Lenke
                brukLenkestyling={false}
                href={url}
                className="mitt-maal"
                disabled={privatModus}
            >
                <img
                    src={mittMalSvg}
                    alt="mittmal-illustrasjon"
                    className="mittmal__illustrasjon"
                />
                <div className="mittmal_content">
                    <Element className="mittmal__content-header">
                        <FormattedMessage id={'aktivitetsmal.mitt-mal'} />
                    </Element>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <Mal mal={mal} privatModus={privatModus} />
                    </Innholdslaster>
                </div>
            </Lenke>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
    privatModus: false,
};

Mal.propTypes = {
    mal: PT.string,
    privatModus: PT.bool.isRequired,
};

MittMaal.defaultProps = {
    mal: undefined,
    privatModus: false,
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
    privatModus: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const ikkeUnderOppfolging = !selectErUnderOppfolging(state);
    const erIkkeBruker = !selectErBruker(state);
    const erPrivatModus =
        erIkkeBruker &&
        ikkeUnderOppfolging &&
        selectViserInneverendePeriode(state);

    return {
        avhengigheter: [selectMalStatus(state)],
        mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
        privatModus: erPrivatModus,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MittMaal);
