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
    harFeature,
    SKJULELDREAKTIVITETER,
} from '../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import {
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../constant';
import { erMerEnnToManederSiden } from '../../utils';
import KolonneFunction from './kolonne/kolonnefunction';
import AktivitetsKort from './../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import SkjulEldreAktiviteter from './kolonne/skjul-eldre-aktiviteter-fra-kolonne';

export function lagAktivitetsListe(aktiviteter) {
    return aktiviteter.map(aktivitet =>
        <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />
    );
}

function renderFullFortAvbryt(aktiviteter) {
    const nyereAktiviteter = aktiviteter.filter(
        aktivitet => !erMerEnnToManederSiden(aktivitet)
    );
    const eldreAktiviteter = aktiviteter.filter(aktivitet =>
        erMerEnnToManederSiden(aktivitet)
    );
    return (
        <div>
            {lagAktivitetsListe(nyereAktiviteter)}
            <SkjulEldreAktiviteter
                aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter}
            />
        </div>
    );
}
// TODO FJERN FUNKSJONEN OG BRUK renderFullFortAvbryt NÅR SKJULELDREAKTIVITETER ER PÅ
function renderFullfortAvbrytFeature(aktiviteter, harSkjuleAktiviteterFeature) {
    if (harSkjuleAktiviteterFeature) {
        return renderFullFortAvbryt(aktiviteter);
    }
    return lagAktivitetsListe(aktiviteter);
}

class AktivitetsTavle extends Component {
    componentDidMount() {
        if (this.props.reducersNotStarted) {
            if (this.props.erVeileder) {
                doLesAktivitetsplan();
            }
            this.props.doHentAktiviteter();
            this.props.doHentArenaAktiviteter();
        }
    }

    render() {
        const { harSkjulAktivitetFeature } = this.props;
        return (
            <Innholdslaster minstEn avhengigheter={this.props.avhengigheter}>
                <Tavle
                    defaultStartKolonne={1}
                    antallKolonner={3}
                    className="aktivitetstavle"
                >
                    <KolonneFunction
                        status={STATUS_BRUKER_ER_INTRESSERT}
                        render={lagAktivitetsListe}
                    />
                    <KolonneFunction
                        status={STATUS_PLANLAGT}
                        render={lagAktivitetsListe}
                    />
                    <KolonneFunction
                        status={STATUS_GJENNOMFOERT}
                        render={lagAktivitetsListe}
                    />
                    <KolonneFunction
                        status={STATUS_FULLFOERT}
                        render={aktiviteter =>
                            renderFullfortAvbrytFeature(
                                aktiviteter,
                                harSkjulAktivitetFeature
                            )}
                    />
                    <KolonneFunction
                        status={STATUS_AVBRUTT}
                        render={aktiviteter =>
                            renderFullfortAvbrytFeature(
                                aktiviteter,
                                harSkjulAktivitetFeature
                            )}
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
    harSkjulAktivitetFeature: PT.bool.isRequired, // TODO SKA FJERNAS NÅR SKJULELDREAKTIVITETER ER PÅ
};

const mapStateToProps = state => {
    const statusAktiviteter = selectAktivitetStatus(state);
    const statusArenaAktiviteter = selectArenaAktivitetStatus(state);

    const reducersNotStarted =
        statusAktiviteter === STATUS.NOT_STARTED &&
        statusArenaAktiviteter === STATUS.NOT_STARTED;

    return {
        erVeileder: selectErVeileder(state),
        avhengigheter: [statusAktiviteter, statusArenaAktiviteter],
        reducersNotStarted,
        harSkjulAktivitetFeature: harFeature(
            SKJULELDREAKTIVITETER,
            selectFeatureData(state)
        ),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch),
    doHentArenaAktiviteter: () => hentArenaAktiviteter()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsTavle);
