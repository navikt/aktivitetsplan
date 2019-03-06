import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import mittMalSvg from './Illustrasjon_dette_gjor_du_bra.svg';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

function Mal({ mal, disabled }) {
    if (!mal) {
        const id = disabled
            ? 'aktivitetsmal.mitt-mal-disabled'
            : 'aktivitetsmal.mitt-mal-deafult';
        return <FormattedMessage tagName="div" id={id} />;
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
        const { avhengigheter, mal, underOppfolging } = this.props;
        const disabled = !!mal || !underOppfolging;
        const url = disabled ? '/mal' : '/mal/endre';
        return (
            <Lenke brukLenkestyling={false} href={url} className="mitt-maal">
                <img
                    tabIndex="-1"
                    src={mittMalSvg}
                    alt=""
                    className="mittmal__illustrasjon"
                />
                <div className="mittmal_content">
                    <Element className="mittmal__content-header">
                        <FormattedMessage id={'aktivitetsmal.mitt-mal'} />
                    </Element>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <Mal disabled={disabled} mal={mal} />
                    </Innholdslaster>
                </div>
            </Lenke>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
    disabled: false,
};

Mal.propTypes = {
    mal: PT.string,
    disabled: PT.bool,
};

MittMaal.defaultProps = {
    mal: undefined,
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    underOppfolging: selectErUnderOppfolging(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MittMaal);
