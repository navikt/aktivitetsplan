import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tavle from './tavle';
import Kolonne from './aktivitetstavlekolonne';
import { hentAktiviteter } from '../../../ducks/aktiviteter';
import { hentArenaAktiviteter } from '../../../ducks/arena-aktiviteter';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../../ducks/utils';

import {
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../../constant';

class AktivitetsTavle extends Component {
    componentDidMount() {
        if (this.props.reducersNotStarted) {
            this.props.doHentAktiviteter();
            this.props.doHentArenaAktiviteter();
        }
    }

    render() {
        return (
            <Innholdslaster avhengigheter={[this.props.aktivitet]}>
                <Tavle
                    defaultStartKolonne={1}
                    antallKolonner={3}
                    className="aktivitetstavle"
                >
                    <Kolonne
                        status={STATUS_BRUKER_ER_INTRESSERT}
                        tittelId="aktivitetstavle.brukerErInteressert"
                    />
                    <Kolonne
                        status={STATUS_PLANLAGT}
                        tittelId="aktivitetstavle.planlagt"
                    />
                    <Kolonne
                        status={STATUS_GJENNOMFOERT}
                        tittelId="aktivitetstavle.gjennomfoert"
                    />
                    <Kolonne
                        status={STATUS_FULLFOERT}
                        tittelId="aktivitetstavle.fullfoert"
                    />
                    <Kolonne
                        status={STATUS_AVBRUTT}
                        tittelId="aktivitetstavle.avbrutt"
                    />
                </Tavle>
            </Innholdslaster>
        );
    }
}

AktivitetsTavle.propTypes = {
    doHentAktiviteter: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    aktivitet: PT.shape({
        status: PT.string.isRequired,
    }),
    reducersNotStarted: PT.bool.isRequired,
};

AktivitetsTavle.defaultProps = {
    aktivitet: undefined,
};

const mapStateToProps = state => {
    const statusAktiviteter = state.data.aktiviteter.status;
    const statusArenaAktiviteter = state.data.arenaAktiviteter.status;

    const reducersNotStarted =
        statusAktiviteter === STATUS.NOT_STARTED &&
        statusArenaAktiviteter === STATUS.NOT_STARTED;
    return {
        aktivitet: state.data.aktiviteter,
        reducersNotStarted,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch),
    doHentArenaAktiviteter: () => hentArenaAktiviteter()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsTavle);
