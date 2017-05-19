import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import TallAlert from '../../felles-komponenter/tall-alert';
import { hentDialog } from '../../ducks/dialog';
import { hentOppfolgingStatus } from '../../ducks/oppfolging-status';
import './navigasjonslinje.less';
import visibleIfHOC from '../../hocs/visible-if'

const NavigasjonsElement = visibleIfHOC(function ({sti, tekstId, children}) {
    return (
        <Lenke href={sti} className="navigasjonslinje__element">
            <Element>
                <FormattedMessage id={tekstId}/>
                <span className="navigasjonslinje__element-content">{children}</span>
            </Element>
        </Lenke>
    );
});

NavigasjonsElement.defaultProps = {
    children: null
};

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node
};

class Navigasjonslinje extends Component {

    componentDidMount() {
        this.props.doHentDialog();
        this.props.doHentOppfolgingStatus();
    }

    render() {
        const { antallUlesteDialoger, underOppfolging } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement sti="/dialog" tekstId="navigasjon.dialog" visible={underOppfolging} >
                    <TallAlert visible={antallUlesteDialoger > 0}>{antallUlesteDialoger}</TallAlert>
                </NavigasjonsElement>
                <NavigasjonsElement sti="/mal" tekstId="aktivitetsmal.mitt-mal" />
                <NavigasjonsElement sti="/vilkar" tekstId="navigasjon.vilkar" />
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired
};

const mapStateToProps = (state) => {
    const dialog = state.data.dialog.data;
    return {
        antallUlesteDialoger: dialog.filter((d) => !d.lest).length,
        underOppfolging: !!state.data.oppfolgingStatus.data.underOppfolging
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentDialog: () => dispatch(hentDialog()),
    doHentOppfolgingStatus: () => dispatch(hentOppfolgingStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
