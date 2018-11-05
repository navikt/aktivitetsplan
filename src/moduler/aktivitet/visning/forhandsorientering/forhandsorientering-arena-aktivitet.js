import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PT from 'prop-types';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { validForm } from 'react-redux-form-validation';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import { autobind, erMerEnnSyvDagerTil } from '../../../../utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import {
    begrensetForhandsorienteringLengde,
    pakrevdForhandsorienteringLengde,
} from '../avtalt-container/avtalt-form';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import {
    HiddenIfAlertStripeInfoSolid,
    HiddenIfAlertStripeSuksess,
} from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';
import { selectErBrukerMedIServiceGruppeSTS } from '../../../oppfoelgingsstatus/oppfoelgingsstatus-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import {
    FORHANDSORIENTERING,
    harFeature,
} from '../../../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../../../felles-komponenter/feature/feature-selector';
import { selectDialogStatus } from '../../../dialog/dialog-selector';
import { STATUS } from '../../../../ducks/utils';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { apneDialog } from '../underelement-for-aktivitet/underelementer-view-reducer';

class ForhandsorienteringArenaAktivitet extends Component {
    constructor() {
        super();
        this.state = {
            skalSendeForhandsorientering: false,
            forhandsorienteringSkalSendes: true,
        };
        autobind(this);
    }

    render() {
        if (
            [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(
                this.props.valgtAktivitet.status
            ) ||
            this.props.erBruker
        ) {
            return null;
        }

        const skallViseForhandsorientering =
            harFeature(FORHANDSORIENTERING, this.props.features) &&
            this.props.erSpecieltTilpassetInnsatsBruker &&
            !this.props.erManuellKrrKvpBruker;

        const lasterData = this.props.dialogStatus !== STATUS.OK;
        const oppdaterer = this.props.dialogStatus === STATUS.RELOADING;

        const merEnnsyvDagerTil =
            erMerEnnSyvDagerTil(this.props.valgtAktivitet.tilDato) ||
            !this.props.valgtAktivitet.tilDato;

        const visAlertStripeHvisMindreEnnSyvDagerTil = (
            <HiddenIfAlertStripeInfoSolid hidden={merEnnsyvDagerTil}>
                <FormattedMessage id="forhandsorientering.arenaaktivitet.mindre-enn-syv-dager" />
            </HiddenIfAlertStripeInfoSolid>
        );

        const checkBoksSendForhandsorientering = (
            <NavCheckbox
                label={this.props.intl.formatMessage({
                    id: 'forhandsorientering.arenaaktivitet.checkbox',
                })}
                onChange={() =>
                    this.setState({
                        skalSendeForhandsorientering: !this.state
                            .skalSendeForhandsorientering,
                    })}
                checked={this.state.skalSendeForhandsorientering}
            />
        );

        const forhandsorieteringsForm =
            this.state.skalSendeForhandsorientering &&
            <form
                onSubmit={formData => {
                    this.props.handleSubmit(formData);
                    this.setState({
                        forhandsorienteringSkalSendes: false,
                    });
                    this.props.doApneDialog();
                }}
            >
                <div className="forhandsorientering-arena-aktivitet">
                    <EtikettLiten className="avtalt-tekst-etikett">
                        <FormattedMessage id="sett-avltalt-tekst-som-sendes" />
                    </EtikettLiten>
                    <HjelpetekstHoyre>
                        <FormattedMessage id="sett-avtalt-teskt-som-sendes-hjelpetekst" />
                    </HjelpetekstHoyre>
                </div>
                <Textarea feltNavn="avtaltText119" maxLength={500} />
                <Knapp spinner={oppdaterer} disabled={lasterData}>
                    <FormattedMessage id="forhandsorientering.arenaaktivitet.bekreft-og-send" />
                </Knapp>
            </form>;

        return (
            <VisibleIfDiv visible={skallViseForhandsorientering}>
                {visAlertStripeHvisMindreEnnSyvDagerTil}
                <VisibleIfDiv
                    visible={
                        this.state.forhandsorienteringSkalSendes &&
                        merEnnsyvDagerTil
                    }
                >
                    <Undertittel>
                        <FormattedMessage id="forhandsorientering.arenaaktivitet.tittel" />
                    </Undertittel>
                    {checkBoksSendForhandsorientering}
                    {forhandsorieteringsForm}
                </VisibleIfDiv>
                <HiddenIfAlertStripeSuksess
                    hidden={this.state.forhandsorienteringSkalSendes}
                >
                    <FormattedMessage id="forhandsorienterin.arenaaktivitet.er-sendt" />
                </HiddenIfAlertStripeSuksess>
            </VisibleIfDiv>
        );
    }
}

ForhandsorienteringArenaAktivitet.propTypes = {
    handleSubmit: PT.func.isRequired,
    doApneDialog: PT.func.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    intl: intlShape.isRequired,
    erManuellKrrKvpBruker: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
    erSpecieltTilpassetInnsatsBruker: PT.bool.isRequired,
    features: PT.array.isRequired,
    dialogStatus: AppPT.status.isRequired,
};

const formNavn = 'send-forhandsorientering-arena-aktivitet-form';
const ForhandsorienteringArenaAktivitetForm = validForm({
    form: formNavn,
    enableReinitialize: false,
    validate: {
        avtaltText119: [
            begrensetForhandsorienteringLengde,
            pakrevdForhandsorienteringLengde,
        ],
    },
})(ForhandsorienteringArenaAktivitet);

const mapStateToProps = (state, props) => ({
    initialValues: {
        avtaltText119: props.intl.formatMessage({
            id: 'sett-forhandsorienterings-tekst-arena-aktivitet',
        }),
    },
    erSpecieltTilpassetInnsatsBruker: selectErBrukerMedIServiceGruppeSTS(state),
    features: selectFeatureData(state),
    erManuellKrrKvpBruker:
        selectErBrukerManuell(state) ||
        selectErUnderKvp(state) ||
        selectReservasjonKRR(state),
    dialogStatus: selectDialogStatus(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: formData => {
        sendForhandsorientering({
            aktivitetId: props.valgtAktivitet.id,
            tekst: formData.avtaltText119,
            overskrift: props.valgtAktivitet.tittel,
        })(dispatch);
    },
    doApneDialog: () => dispatch(apneDialog()),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
        ForhandsorienteringArenaAktivitetForm
    )
);
