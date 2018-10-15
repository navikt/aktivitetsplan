import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tavle from './tavle';
import Kolonne from './aktivitetstavlekolonne';
import * as AppPT from '../../proptypes';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
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
import { doLesAktivitetsplan } from '../../moduler/oppfolging-status/oppfolging-api';
import { selectAktivitetListe } from '../../moduler/aktivitet/aktivitetliste-selector';
import { sorterAktiviteter } from '../../moduler/aktivitet/aktivitet-util';
import { erMerEnnToManederSiden } from '../../utils';
import SkjulEldreAktiviteter from './skjul-eldre-aktiviteter-fra-kolonne';
import AktivitetsKort from '../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import {
    harFeature,
    SKJULELDREAKTIVITETER,
} from '../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';

function lagAktivitetsListe(aktiviteter) {
    return aktiviteter.map(aktivitet =>
        <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />
    );
}

function renderFullfortAvbrytStatus(
    aktiviteter,
    HAR_SKJULELDREAKTIVITETER_FEATURE
) {
    // SKJULELDREAKTIVITETER ALLT INNANFØR IFSATSEN SKA RETURNERAS NÅR FEATURETOGGLEN ER PÅ
    // RESTEN KAN FJERNES
    if (HAR_SKJULELDREAKTIVITETER_FEATURE) {
        return (
            <div>
                {lagAktivitetsListe(
                    aktiviteter.filter(
                        aktivitet => !erMerEnnToManederSiden(aktivitet)
                    )
                )}
                <SkjulEldreAktiviteter
                    aktivitetTilDatoMerEnnToManederSiden={aktiviteter.filter(
                        erMerEnnToManederSiden
                    )}
                />
            </div>
        );
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
        const sorterteAktiviteter = [
            STATUS_BRUKER_ER_INTRESSERT,
            STATUS_PLANLAGT,
            STATUS_GJENNOMFOERT,
            STATUS_FULLFOERT,
            STATUS_AVBRUTT,
        ].map(status => sorterAktiviteter(this.props.aktiviteter, status));

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
                        aktiviteter={sorterteAktiviteter[0]}
                        render={lagAktivitetsListe}
                    />
                    <Kolonne
                        status={STATUS_PLANLAGT}
                        tittelId="aktivitetstavle.planlagt"
                        aktiviteter={sorterteAktiviteter[1]}
                        render={lagAktivitetsListe}
                    />
                    <Kolonne
                        status={STATUS_GJENNOMFOERT}
                        tittelId="aktivitetstavle.gjennomfoert"
                        aktiviteter={sorterteAktiviteter[2]}
                        render={lagAktivitetsListe}
                    />
                    <Kolonne
                        status={STATUS_FULLFOERT}
                        tittelId="aktivitetstavle.fullfoert"
                        aktiviteter={sorterteAktiviteter[3]}
                        render={aktiviteter =>
                            renderFullfortAvbrytStatus(
                                aktiviteter,
                                this.props.harSkjulAktivitetFeature
                            )}
                    />
                    <Kolonne
                        status={STATUS_AVBRUTT}
                        tittelId="aktivitetstavle.avbrutt"
                        aktiviteter={sorterteAktiviteter[4]}
                        render={aktiviteter =>
                            renderFullfortAvbrytStatus(
                                aktiviteter,
                                this.props.harSkjulAktivitetFeature
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
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    harSkjulAktivitetFeature: PT.bool.isRequired, // SKA FJERNAS NÅR SKJULELDREAKTIVITETER ER PÅ
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
        aktiviteter: selectAktivitetListe(state),
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
