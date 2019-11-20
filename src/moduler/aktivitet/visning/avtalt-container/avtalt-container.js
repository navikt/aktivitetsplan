import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { STATUS_AVBRUTT, STATUS_FULLFOERT, UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import AvtaltForm, { IKKE_SEND_FORHANDSORIENTERING, SEND_FORHANDSORIENTERING, SEND_PARAGRAF_11_9 } from './avtalt-form';
import { oppdaterAktivitet } from '../../aktivitet-actions';
import * as AppPT from '../../../../proptypes';
import { STATUS } from '../../../../ducks/utils';
import { selectAktiviteterData, selectAktivitetStatus } from '../../aktivitet-selector';
import { erGyldigISODato, erMerEnnSyvDagerTil, msSince } from '../../../../utils';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectOppfolgingsPerioder,
    selectReservasjonKRR
} from '../../../oppfolging-status/oppfolging-selector';
import { apneDialog } from '../underelement-for-aktivitet/underelementer-view-reducer';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import DeleLinje from '../delelinje/delelinje';

class AvtaltContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visBekreftAvtalt: false,
            forhandsorienteringSent: false,
            forhandsorienteringType: ''
        };
    }

    render() {
        const {
            aktivitet,
            aktivitetStatus,
            doSetAktivitetTilAvtalt,
            doSendForhandsorientering,
            className,
            erManuellKrrKvpBruker,
            doApneDialog,
            underOppfolging,
            harAvtalteAktiviteter,
            aktivOppfolgingsPeriode
        } = this.props;

        const { visBekreftAvtalt, forhandsorienteringSent, forhandsorienteringType } = this.state;

        const { type, status, historisk, avtalt } = aktivitet;

        const lasterData = aktivitetStatus !== STATUS.OK;
        const oppdaterer = aktivitetStatus === STATUS.RELOADING;
        const arenaAktivitet = UTDANNING_AKTIVITET_TYPE === type;
        const merEnnsyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato);

        if (
            !window.appconfig.TILLAT_SET_AVTALT ||
            historisk ||
            !underOppfolging ||
            status === STATUS_FULLFOERT ||
            status === STATUS_AVBRUTT ||
            arenaAktivitet
        ) {
            return null;
        }

        const visAvtaltMedNavMindreEnnSyvDager = !avtalt && !merEnnsyvDagerTil;

        // Kun vis bekreftet hvis nettopp satt til avtalt.
        if (visBekreftAvtalt === false && avtalt) {
            return null;
        }

        const avtaltTextMap = {
            [SEND_FORHANDSORIENTERING]: avtaltForm => avtaltForm.avtaltText,
            [SEND_PARAGRAF_11_9]: avtaltForm => avtaltForm.avtaltText119,
            [IKKE_SEND_FORHANDSORIENTERING]: () => ''
        };

        const avtaltInnholdForhandsvarsel = (
            <AvtaltForm
                className={`${className} avtalt-container`}
                oppdaterer={oppdaterer}
                visAvtaltMedNavMindreEnnSyvDager={visAvtaltMedNavMindreEnnSyvDager}
                erManuellKrrKvpBruker={erManuellKrrKvpBruker}
                lasterData={lasterData}
                onSubmit={avtaltForm => {
                    this.setState({ visBekreftAvtalt: true });
                    const avtaltText = avtaltTextMap[avtaltForm.avtaltSelect](avtaltForm);
                    const skalSendeVarsel = !!avtaltText && merEnnsyvDagerTil && !erManuellKrrKvpBruker;
                    if (skalSendeVarsel) {
                        doSendForhandsorientering(aktivitet, avtaltText);
                        this.setState({
                            forhandsorienteringSent: true,
                            forhandsorienteringType: avtaltForm.avtaltSelect
                        });
                        doApneDialog();
                    }

                    loggForhandsorientering(erManuellKrrKvpBruker, !merEnnsyvDagerTil, avtaltForm.avtaltSelect);

                    if (
                        !harAvtalteAktiviteter &&
                        aktivOppfolgingsPeriode &&
                        erGyldigISODato(aktivOppfolgingsPeriode.startDato)
                    ) {
                        metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.startDato));
                    }

                    doSetAktivitetTilAvtalt(aktivitet);
                    document.querySelector('.aktivitet-modal').focus();
                    return Promise.resolve();
                }}
            />
        );

        const settAvtaltTekstVerdi =
            (!merEnnsyvDagerTil && 'avtaltMedNavMindreEnnSyvDager') ||
            (erManuellKrrKvpBruker && 'erManuellKrrKvpBruker') ||
            (forhandsorienteringSent && 'forhandsorienteringSent') ||
            (!forhandsorienteringSent && 'forhandsorienteringIkkeSent');

        const visAvtalt = (
            <div className={className}>
                <AlertStripeSuksess>
                    <FormattedMessage
                        id="sett-avtalt-bekreftelse"
                        values={{
                            settAvtaltTekstVerdi,
                            forhandsorienteringType
                        }}
                    />
                </AlertStripeSuksess>
            </div>
        );

        return (
            <div>
                {aktivitet.avtalt ? visAvtalt : avtaltInnholdForhandsvarsel}
                <DeleLinje />
            </div>
        );
    }
}

AvtaltContainer.propTypes = {
    doSetAktivitetTilAvtalt: PT.func.isRequired,
    doSendForhandsorientering: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    aktivitetStatus: AppPT.status,
    className: PT.string,
    erManuellKrrKvpBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    doApneDialog: PT.func.isRequired,
    harAvtalteAktiviteter: PT.bool.isRequired,
    aktivOppfolgingsPeriode: AppPT.oppfolgingsPeriode
};

AvtaltContainer.defaultProps = {
    aktivitetStatus: undefined,
    className: undefined,
    aktivOppfolgingsPeriode: undefined
};

const mapStateToProps = state => ({
    aktivitetStatus: selectAktivitetStatus(state),
    harAvtalteAktiviteter:
        selectAktiviteterData(state)
            .filter(aktivitet => aktivitet.avtalt)
            .filter(a => !a.historisk).length !== 0,
    aktivOppfolgingsPeriode: selectOppfolgingsPerioder(state).filter(periode => !periode.sluttDato)[0],
    erManuellKrrKvpBruker: selectErBrukerManuell(state) || selectErUnderKvp(state) || selectReservasjonKRR(state)
});

const mapDispatchToProps = dispatch => ({
    doSetAktivitetTilAvtalt: aktivitet => {
        oppdaterAktivitet({ ...aktivitet, avtalt: true })(dispatch);
    },
    doSendForhandsorientering: (aktivitet, avtaltTekst) => {
        sendForhandsorientering({
            aktivitetId: aktivitet.id,
            tekst: avtaltTekst,
            overskrift: aktivitet.tittel
        })(dispatch);
    },
    doApneDialog: () => dispatch(apneDialog())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AvtaltContainer);
