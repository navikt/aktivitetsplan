import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import NavigasjonslinjeMeny from './navigasjonslinje-meny';
import Lenke from '../../../felles-komponenter/utils/lenke';
import Feature from '../../../felles-komponenter/feature/feature';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { hentDialog } from '../../../ducks/dialog';
import { dialogFilter } from '../../../moduler/filter/filter-utils';
import visibleIfHOC from '../../../hocs/visible-if';

const NavigasjonsElement = visibleIfHOC(({ sti, tekstId, children }) =>
    <Lenke href={sti} className="navigasjonslinje__element">
        <Element>
            <FormattedMessage id={tekstId} />
            <span className="navigasjonslinje__element-content">
                {children}
            </span>
        </Element>
    </Lenke>
);

NavigasjonsElement.defaultProps = {
    children: null,
};

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node,
};

class Navigasjonslinje extends Component {
    componentDidMount() {
        this.props.doHentDialog();
    }

    render() {
        const { antallUlesteDialoger, underOppfolging } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement
                    sti="/dialog"
                    tekstId="navigasjon.dialog"
                    visible={underOppfolging}
                >
                    <TallAlert hidden={antallUlesteDialoger <= 0}>
                        {antallUlesteDialoger}
                    </TallAlert>
                </NavigasjonsElement>
                <NavigasjonsElement
                    sti="/mal"
                    tekstId="aktivitetsmal.mitt-mal"
                />
                <NavigasjonsElement sti="/vilkar" tekstId="navigasjon.vilkar" />
                <Feature name="navigasjonslinjemeny">
                    <NavigasjonslinjeMeny />
                </Feature>
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const dialog = state.data.dialog.data;
    return {
        antallUlesteDialoger: dialog
            .filter(d => !d.lest)
            .filter(d => dialogFilter(d, state)).length,
        underOppfolging: !!state.data.situasjon.data.underOppfolging,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
