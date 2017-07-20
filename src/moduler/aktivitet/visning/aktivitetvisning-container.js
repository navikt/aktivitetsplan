import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PT from 'prop-types';
import moment from 'moment';
import { TILLAT_SLETTING } from '~config'; // eslint-disable-line
import {
    hentAktivitet,
    hentAktiviteter,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../aktivitet-actions';
import { hentArenaAktiviteter } from '../../../ducks/arena-aktiviteter';
import Aktivitetvinsing from './aktivitetvisning';
import * as AppPT from '../../../proptypes';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import StandardModal from '../../../felles-komponenter/modal/modal-standard';

class AktivitetvisningContainer extends Component {
    componentDidMount() {
        if (!isNaN(this.props.params.id)) {
            this.props.doHentAktivitet(this.props.params.id);
        }
        this.props.doHentArenaAktiviteter();
        this.props.doHentAktiviteter();
        this.props.doFjernForrigeAktiveAktivitetId();
    }

    componentWillUnmount() {
        this.props.doSettForrigeAktiveAktivitetId(this.props.params.id);
    }

    render() {
        const { params, aktiviteter, arenaAktiviteter, situasjon } = this.props;
        const { id } = params;

        const alleAktiviter = aktiviteter.data.concat(arenaAktiviteter.data);
        const valgtAktivitet = alleAktiviter.find(
            aktivitet => aktivitet.id === id
        );

        const slettingErTillatt =
            TILLAT_SLETTING &&
            (!situasjon.data.underOppfolging ||
                moment(situasjon.data.oppfolgingUtgang).isAfter(
                    valgtAktivitet.opprettetDato
                ));

        return (
            <StandardModal name="aktivitetsvisningModal">
                <Innholdslaster
                    avhengigheter={[aktiviteter, arenaAktiviteter, situasjon]}
                >
                    <Aktivitetvinsing
                        aktivitet={valgtAktivitet}
                        tillatSletting={slettingErTillatt}
                    />
                </Innholdslaster>
            </StandardModal>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    params: PT.shape({ id: PT.string }).isRequired,
    situasjon: AppPT.situasjon.isRequired,
    aktiviteter: PT.oneOfType([PT.arrayOf(AppPT.aktivitet), AppPT.aktivitet]),
    arenaAktiviteter: PT.oneOfType([PT.object, PT.arrayOf(PT.object)]),
    doHentAktivitet: PT.func.isRequired,
    doHentAktiviteter: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    aktiviteter: [],
    arenaAktiviteter: [],
};

const mapStateToProps = state => ({
    situasjon: state.data.situasjon,
    aktiviteter: state.data.aktiviteter,
    arenaAktiviteter: state.data.arenaAktiviteter,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doHentAktivitet: hentAktivitet,
            doHentAktiviteter: hentAktiviteter,
            doHentArenaAktiviteter: hentArenaAktiviteter,
            doSettForrigeAktiveAktivitetId: settForrigeAktiveAktivitetId,
            doFjernForrigeAktiveAktivitetId: fjernForrigeAktiveAktivitetId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetvisningContainer
);
