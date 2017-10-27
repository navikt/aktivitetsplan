import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tavle from './tavle';
import Kolonne from './aktivitetstavlekolonne';
import * as AppPT from '../../proptypes';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';

import {
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../constant';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';

class AktivitetsTavle extends Component {
    componentDidMount() {
        if (this.props.reducersNotStarted) {
            this.props.doHentAktiviteter();
            this.props.doHentArenaAktiviteter();
        }
    }

    render() {
        return (
            <Innholdslaster minstEn avhengigheter={this.props.avhengigheter}>
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
    avhengigheter: AppPT.avhengigheter.isRequired,
    reducersNotStarted: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const statusAktiviteter = selectAktivitetStatus(state);
    const statusArenaAktiviteter = selectArenaAktivitetStatus(state);

    const reducersNotStarted =
        statusAktiviteter === STATUS.NOT_STARTED &&
        statusArenaAktiviteter === STATUS.NOT_STARTED;

    return {
        avhengigheter: [statusAktiviteter, statusArenaAktiviteter],
        reducersNotStarted,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch),
    doHentArenaAktiviteter: () => hentArenaAktiviteter()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsTavle);
