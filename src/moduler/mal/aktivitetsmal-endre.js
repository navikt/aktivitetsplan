import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import AktivitetsmalForm from './aktivitetsmal-form';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import AktivitetsmalModal from './aktivitetsmal-modal';
import {
    hentMal,
    selectMalStatus,
    selectGjeldendeMal,
} from './aktivitetsmal-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';

class AktivitetmalEndre extends Component {
    componentDidMount() {
        this.props.doHentMal();
    }

    render() {
        const { mal, avhengigheter, history, erVeileder } = this.props;

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
                <section className="aktivitetmal aktivitetmal__innhold">
                    <AktivitetsmalForm
                        mal={mal}
                        handleComplete={() => {
                            history.push('mal/');
                            loggMittMalLagre(erVeileder);
                        }}
                    />
                </section>
            </Innholdslaster>
        );
    }
}

AktivitetmalEndre.defaultProps = {
    mal: null,
};

AktivitetmalEndre.propTypes = {
    mal: AppPT.mal,
    doHentMal: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    history: AppPT.history.isRequired,
    erVeileder: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    mal: selectGjeldendeMal(state),
    avhengigheter: [selectMalStatus(state)],
    erVeileder: selectErVeileder(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => hentMal()(dispatch),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetmalEndre)
);
