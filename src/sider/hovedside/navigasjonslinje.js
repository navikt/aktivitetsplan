import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import TallAlert from '../../felles-komponenter/tall-alert';
import { hentDialog } from '../../ducks/dialog';
import './navigasjonslinje.less';

function NavigasjonsElement({ sti, tekstId, children }) {
    return (
        <Lenke href={sti} className="navigasjonslinje__element">
            <Element><FormattedMessage id={tekstId} /><span className="navigasjonslinje__element-content">{children}</span></Element>
        </Lenke>
    );
}

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node
};

NavigasjonsElement.defaultProps = {
    children: null
};

class Navigasjonslinje extends Component {

    componentDidMount() {
        this.props.doHentDialog();
    }

    render() {
        const { antallUlesteDialoger } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement sti="/dialog" tekstId="navigasjon.dialog">
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
        antallUlesteDialoger: dialog.filter((d) => !d.lest).length
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentDialog: () => hentDialog()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
