import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tavle from './tavle';
import {
    AvbruttKolonne,
    ForslagKolonne,
    FullfortKolonne,
    GjennomforerKolonne,
    PlanleggerKolonne,
} from './kolonne/aktivitetstavlekolonner';
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
import { selectAktivitetListe } from '../../moduler/aktivitet/aktivitetliste-selector';

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
        const { aktiviteter, harSkjulAktivitetFeature } = this.props;
        return (
            <Innholdslaster minstEn avhengigheter={this.props.avhengigheter}>
                <Tavle
                    defaultStartKolonne={1}
                    antallKolonner={3}
                    className="aktivitetstavle"
                >
                    <ForslagKolonne aktiviteter={aktiviteter} />
                    <PlanleggerKolonne aktiviteter={aktiviteter} />
                    <GjennomforerKolonne aktiviteter={aktiviteter} />
                    <FullfortKolonne
                        aktiviteter={aktiviteter}
                        harSkjulAktivitetFeature={harSkjulAktivitetFeature}
                    />
                    <AvbruttKolonne
                        aktiviteter={aktiviteter}
                        harSkjuleAktiviteterFeature={harSkjulAktivitetFeature}
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
