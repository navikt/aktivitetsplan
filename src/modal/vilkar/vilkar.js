import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Bilde from 'nav-react-design/dist/bilde';
import { Innholdstittel } from 'nav-frontend-typografi';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import { autobind } from '../../utils';
import * as AppPT from '../../proptypes';
import vilkarSvg from './vilkar-illustrasjon.svg';
import { hentVilkar } from '../../ducks/vilkar';
import './vilkar.less';

class Vilkar extends Component {

    constructor(props) {
        super(props);
        autobind(this);
    }

    componentDidMount() {
        if (this.props.vilkar.status === STATUS.NOT_STARTED) {
            this.props.doHentVilkar();
        }
    }

    render() {
        const { visVilkar, vilkar } = this.props;
        const { tekst, hash } = vilkar.data;

        return (
            <div className="vilkar">

                {visVilkar && (
                    <div className="vilkar__innhold">
                        <Bilde src={vilkarSvg} alt="Dekorativ illustrajon" />
                        <Innholdstittel className="vilkar__tittel"><FormattedMessage id="vilkar.tittel" /></Innholdstittel>
                        <Innholdslaster avhengigheter={[vilkar]}>
                            <UnsafeHtml className="vilkar__tekst">{tekst}</UnsafeHtml>
                        </Innholdslaster>
                    </div>
                )}
            </div>
        );
    }
}

Vilkar.propTypes = {
    doHentVilkar: PT.func.isRequired,
    vilkar: AppPT.vilkar.isRequired,
    visVilkar: PT.bool.isRequired
};


const mapStateToProps = (state) => ({
    vilkar: state.data.vilkar
});

const mapDispatchToProps = (dispatch) => ({
    doHentVilkar: () => dispatch(hentVilkar())
});

export default connect(mapStateToProps, mapDispatchToProps)(Vilkar);
