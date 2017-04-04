import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import { hentDialog } from '../../ducks/dialog';
import './navigasjonslinje.less';

function NavigasjonsElement({ sti, tekstId, children }) {
    return (
        <Lenke href={sti} className="navigasjonslinje__element">
            <Element><FormattedMessage id={tekstId} />{children}</Element>
        </Lenke>
    );
}

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node
};

class Navigasjonslinje extends Component {

    componentDidMount() {
        this.props.doHentDialog();
    }

    render() {
        const { antallDialoger } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement sti="/" tekstId="navigasjon.min-plan" />
                <NavigasjonsElement sti="/dialog" tekstId="navigasjon.dialog">{antallDialoger && `(${antallDialoger})` }</NavigasjonsElement>
                <NavigasjonsElement sti="/vilkar" tekstId="navigasjon.vilkar" />
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallDialoger: PT.number.isRequired
};

const mapStateToProps = (state) => {
    const dialog = state.data.dialog.data;
    return {
        antallDialoger: dialog.length
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentDialog: () => hentDialog()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
