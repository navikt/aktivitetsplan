import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import mittMalSvg from './Illustrasjon_dette_gjor_du_bra.svg';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

const Mal = ({ mal }) => {
    if (!mal) {
        return (
            <div>
                <FormattedMessage id={'aktivitetsmal.mitt-mal-deafult'} />
            </div>
        );
    }
    return (
        <i>
            <Tekstomrade>
                {`"${mal}"`}
            </Tekstomrade>
        </i>
    );
};

class MittMaal extends Component {
    componentDidMount() {
        if (this.props.erPaInnsiden) {
            this.props.doHentMal();
        }
    }

    render() {
        const { avhengigheter, mal, erPaInnsiden } = this.props;
        const url = mal ? '/mal' : '/mal/endre';

        return (
            <HiddenIfDiv hidden={!erPaInnsiden}>
                <Lenke
                    brukLenkestyling={false}
                    href={url}
                    className="mitt-maal"
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
                            <Mal mal={mal} />
                        </Innholdslaster>
                    </div>
                </Lenke>
            </HiddenIfDiv>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
};

Mal.propTypes = {
    mal: PT.string,
};

MittMaal.defaultProps = {
    mal: undefined,
    erPaInnsiden: undefined,
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
    erPaInnsiden: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    erPaInnsiden: selectErVeileder(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MittMaal);
