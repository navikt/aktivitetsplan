import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tavle from './tavle';
import * as AppPT from '../../proptypes';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { STATUS } from '../../ducks/utils';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { doLesAktivitetsplan } from '../../moduler/oppfolging-status/oppfolging-api';
import {
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../constant';
import KolonneFunction from './kolonne/kolonnefunction';
import AktivitetsKort from '../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import SkjulEldreAktiviteter from './kolonne/skjul-eldre-aktiviteter-fra-kolonne';
import { splitIEldreOgNyereAktiviteter } from '../../moduler/aktivitet/aktivitet-util';

function lagAktivitetsListe(aktiviteter) {
    return aktiviteter.map((aktivitet) => <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />);
}

function renderFullFortAvbryt(aktiviteter) {
    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(aktiviteter);
    return (
        <div>
            {lagAktivitetsListe(nyereAktiviteter)}
            <SkjulEldreAktiviteter aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter} />
        </div>
    );
}

class AktivitetsTavle extends Component {
    componentDidMount() {
        const { reducersNotStarted, erVeileder, doHentAktiviteter, doHentArenaAktiviteter } = this.props;
        if (reducersNotStarted) {
            if (erVeileder) {
                doLesAktivitetsplan();
            }
            doHentAktiviteter();
            doHentArenaAktiviteter();
        }
    }

    render() {
        const { avhengigheter } = this.props;
        return (
            <Innholdslaster minstEn avhengigheter={avhengigheter}>
                <Tavle defaultStartKolonne={1} antallKolonner={3} className="aktivitetstavle">
                    <KolonneFunction status={STATUS_BRUKER_ER_INTRESSERT} render={lagAktivitetsListe} />
                    <KolonneFunction status={STATUS_PLANLAGT} render={lagAktivitetsListe} />
                    <KolonneFunction status={STATUS_GJENNOMFOERT} render={lagAktivitetsListe} />
                    <KolonneFunction
                        status={STATUS_FULLFOERT}
                        render={(aktiviteter) => renderFullFortAvbryt(aktiviteter)}
                    />
                    <KolonneFunction
                        status={STATUS_AVBRUTT}
                        render={(aktiviteter) => renderFullFortAvbryt(aktiviteter)}
                    />
                </Tavle>
            </Innholdslaster>
        );
    }
}

AktivitetsTavle.propTypes = {
    doHentAktiviteter: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    erVeileder: PT.bool.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    reducersNotStarted: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
    const statusAktiviteter = selectAktivitetStatus(state);
    const statusArenaAktiviteter = selectArenaAktivitetStatus(state);

    const reducersNotStarted =
        statusAktiviteter === STATUS.NOT_STARTED && statusArenaAktiviteter === STATUS.NOT_STARTED;

    const avhengigheter = [statusAktiviteter, statusArenaAktiviteter];

    return {
        erVeileder: selectErVeileder(state),
        avhengigheter,
        reducersNotStarted,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch),
    doHentArenaAktiviteter: () => hentArenaAktiviteter()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsTavle);
