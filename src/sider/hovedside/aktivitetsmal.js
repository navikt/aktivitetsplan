import React, {Component, PropTypes as PT} from "react";
import {connect} from "react-redux";
import * as AppPT from "../../proptypes";
import EkspanderbartPanel from "nav-frontend-ekspanderbartpanel";
import {hentMal} from "../../ducks/mal";
import {Hovedknapp} from "nav-react-design/dist/knapp";

class AktivitetsMal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redigering: false
        };
    }

    hentGjeldendeMal = () => {
        this.props.doHentMal();
    }

    render() {
        const {mal, endretAv, dato} = this.props.mal;
        return (
            <div>
                <EkspanderbartPanel tittel="Mål" onClick={this.hentGjeldendeMal}>
                    {this.state.redigering && (
                        <div>
                            <div>{mal}</div>
                            <Hovedknapp onClick={() => console.log('rediger')}>Rediger</Hovedknapp>
                        </div>
                    )}
                </EkspanderbartPanel>
            </div>

        );
    }
}

AktivitetsMal.propTypes = {
    mal: AppPT.mal,
    doHentMal: PT.func.isRequired,
};

const mapStateToProps = (state) => ({
    mal: state.data.mal.data
});

const mapDispatchToProps = (dispatch) => ({
    doHentMal: () => hentMal()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal);
