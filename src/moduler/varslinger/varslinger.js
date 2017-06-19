import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentIdentitet } from '../../ducks/identitet';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import hiddenIf, {
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';

const Varsling = hiddenIf(({ tekstId }) => (
    <AlertStripeInfoSolid className="varsling">
        <FormattedMessage id={tekstId} />
    </AlertStripeInfoSolid>
));

class Varslinger extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const {
            identitetReducer,
            erBruker,
            oppfolgingStatusReducer,
            underOppfolging,
            vilkarMaBesvares,
        } = this.props;
        return (
            <Innholdslaster
                avhengigheter={[oppfolgingStatusReducer, identitetReducer]}
            >
                <HiddenIfDiv hidden={erBruker}>
                    <Varsling
                        hidden={underOppfolging}
                        tekstId="oppfolging.ikke-under-oppfolging"
                    />
                    <Varsling
                        hidden={!vilkarMaBesvares}
                        tekstId="oppfolging.vilkar-ikke-godkjent"
                    />
                </HiddenIfDiv>
            </Innholdslaster>
        );
    }
}

Varslinger.propTypes = {
    identitetReducer: AppPT.reducer.isRequired,
    erBruker: PT.bool.isRequired,
    oppfolgingStatusReducer: AppPT.reducer.isRequired,
    underOppfolging: PT.bool.isRequired,
    vilkarMaBesvares: PT.bool.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const identitetReducer = stateData.identitet;
    const oppfolgingStatusReducer = stateData.oppfolgingStatus;
    const oppfoldingStatus = oppfolgingStatusReducer.data;
    return {
        identitetReducer,
        erBruker: identitetReducer.data.erBruker,

        oppfolgingStatusReducer,
        vilkarMaBesvares: oppfoldingStatus.vilkarMaBesvares,
        underOppfolging: oppfoldingStatus.underOppfolging,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
