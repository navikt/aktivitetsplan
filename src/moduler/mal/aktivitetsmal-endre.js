import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../../proptypes';
import AktivitetsmalForm from './aktivitetsmal-form';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import AktivitetsmalModal from './aktivitetsmal-modal';
import history from '../../../history';
import {
    hentMal,
    selectMalStatus,
    selectGjeldendeMal,
} from '../../../moduler/mal/mal-reducer';

class AktivitetmalEndre extends Component {
    componentDidMount() {
        this.props.doHentMal();
    }

    render() {
        const { mal, avhengigheter } = this.props;

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
                <section className="aktivitetmal aktivitetmal__innhold">
                    <AktivitetsmalForm
                        mal={mal}
                        handleComplete={() => history.push('mal/')}
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
};

const mapStateToProps = state => ({
    mal: selectGjeldendeMal(state),
    avhengigheter: [selectMalStatus(state)],
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => hentMal()(dispatch),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetmalEndre)
);
