import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PT from 'prop-types';
import moment from 'moment';
import { TILLAT_SLETTING } from '~config'; // eslint-disable-line
import {
    hentAktivitet,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../aktivitet-actions';
import Aktivitetvinsing from './aktivitetvisning';
import * as AppPT from '../../../proptypes';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';

class AktivitetvisningContainer extends Component {
    componentDidMount() {
        if (!isNaN(this.props.params.id)) {
            this.props.doHentAktivitet(this.props.params.id);
        }
        this.props.doFjernForrigeAktiveAktivitetId();
    }

    componentWillUnmount() {
        this.props.doSettForrigeAktiveAktivitetId(this.props.params.id);
    }

    slettingErTillatt(valgtAktivitet) {
        return (
            TILLAT_SLETTING &&
            (!this.situasjon.data.underOppfolging ||
                moment(this.situasjon.data.oppfolgingUtgang).isAfter(
                    valgtAktivitet.opprettetDato
                ))
        );
    }

    render() {
        const { params, aktiviteter, arenaAktiviteter, situasjon } = this.props;
        const { id } = params;

        const alleAktiviter = aktiviteter.data.concat(arenaAktiviteter.data);
        const valgtAktivitet = alleAktiviter.find(
            aktivitet => aktivitet.id === id
        );

        return (
            <Innholdslaster
                avhengigheter={[aktiviteter, arenaAktiviteter, situasjon]}
            >
                <Aktivitetvinsing
                    aktivitet={valgtAktivitet}
                    tillatSletting={this.slettingErTillatt(valgtAktivitet)}
                />
            </Innholdslaster>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    doHentAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    situasjon: AppPT.situasjon.isRequired,
    aktiviteter: PT.arrayOf(PT.object),
    arenaAktiviteter: PT.arrayOf(PT.object),
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
            doSettForrigeAktiveAktivitetId: settForrigeAktiveAktivitetId,
            doFjernForrigeAktiveAktivitetId: fjernForrigeAktiveAktivitetId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetvisningContainer
);
