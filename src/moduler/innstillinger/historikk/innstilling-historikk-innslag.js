import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { DatoEllerTidSiden } from '../../../felles-komponenter/dato';
import { hentVeileder } from '../../../ducks/veileder-reducer';
import * as AppPT from '../../../proptypes';
import KnappLenke from '../../../felles-komponenter/utils/knappelenke';
import {
    oppgavetyper,
    temaValg,
} from './../opprett-oppgave/opprett-oppgave-utils';
import { selectAlleDialoger } from '../../dialog/dialog-selector';
import { selectHistoriskeOppfolgingsPerioder } from '../../oppfolging-status/oppfolging-selector';
import { dateToISODate, erTidspunktIPeriode } from '../../../utils';
import { velgHistoriskPeriode } from '../../filtrering/filter/filter-reducer';
import history from '../../../history';

const NAV = 'NAV';
const SYSTEM = 'SYSTEM';
const EKSTERN = 'EKSTERN';

const ESKALERING_STOPPET = 'ESKALERING_STOPPET';
const ESKALERING_STARTET = 'ESKALERING_STARTET';
const OPPRETTET_OPPGAVE = 'OPPRETTET_OPPGAVE';
const ESKALERING_MAX_LENGTH = 120;

class InnstillingHistorikkInnslag extends Component {
    componentWillMount() {
        const innstillingHistorikk = this.props.innstillingHistorikk;
        if (innstillingHistorikk.opprettetAv === NAV) {
            this.props.doHentVeileder(innstillingHistorikk.opprettetAvBrukerId);
        }
    }

    settHistoriskPeriodeForDialog(dialogId) {
        const {
            dialoger,
            historiskePerioder,
            doVelgHistoriskPeriode,
        } = this.props;

        const historiskDialog = dialoger
            .filter(dialog => dialog.historisk)
            .find(dialog => dialog.id === `${dialogId}`);

        if (historiskDialog) {
            const dialogAvsluttet = historiskDialog.sisteDato;
            const historiskPeriode = historiskePerioder.find(periode =>
                erTidspunktIPeriode(dialogAvsluttet, periode.fra, periode.til)
            );
            doVelgHistoriskPeriode(historiskPeriode, dialogId);
        }
    }

    hentKomponentMedNavn() {
        const {
            opprettetAv,
            opprettetAvBrukerId,
        } = this.props.innstillingHistorikk;
        switch (opprettetAv) {
            case NAV:
                return (
                    <FormattedMessage
                        id="innstillinger.historikk.innslag.opprettet-av-nav"
                        values={{
                            veileder: `${this.props.veileder[
                                opprettetAvBrukerId
                            ] || ''}`,
                        }}
                    />
                );
            case SYSTEM:
                return (
                    <FormattedMessage id="innstillinger.historikk.innslag.opprettet-av-system" />
                );
            case EKSTERN:
                return (
                    <FormattedMessage id="innstillinger.historikk.innslag.opprettet-av-ekstern" />
                );
            default:
                return null;
        }
    }

    render() {
        const {
            type,
            dato,
            begrunnelse,
            dialogId,
            oppgaveTema,
            oppgaveType,
        } = this.props.innstillingHistorikk;

        const { intl } = this.props;
        const tekstType = type.replace(/_/g, '-').toLowerCase();
        const innslagHeaderId = `innstillinger.historikk.innslag.${tekstType}`;

        const historikkdata = () => {
            if (type === OPPRETTET_OPPGAVE) {
                return (
                    <Normaltekst className="innslag__begrunnelse">
                        <FormattedMessage
                            id="innstillinger.opprett.oppgave.historikk.data"
                            values={{
                                oppgavetema: intl.formatMessage({
                                    id: temaValg[oppgaveTema],
                                }),
                                oppgavetype: intl.formatMessage({
                                    id: oppgavetyper[oppgaveType],
                                }),
                            }}
                        />
                    </Normaltekst>
                );
            }
            if ([ESKALERING_STARTET, ESKALERING_STOPPET].includes(type)) {
                const begrunnelseTekst =
                    !!begrunnelse && begrunnelse.length > ESKALERING_MAX_LENGTH
                        ? `${begrunnelse.substring(
                              0,
                              ESKALERING_MAX_LENGTH
                          )}... `
                        : `${begrunnelse} `;
                return (
                    <Normaltekst className="innslag__begrunnelse">
                        {begrunnelseTekst}
                        <KnappLenke
                            onClick={() =>
                                this.settHistoriskPeriodeForDialog(dialogId)}
                        >
                            <FormattedMessage
                                id={'innstillinger.historikk.innslag.les_mer'}
                            />
                        </KnappLenke>
                    </Normaltekst>
                );
            }

            return (
                <Normaltekst className="innslag__begrunnelse">
                    {begrunnelse}
                </Normaltekst>
            );
        };

        return (
            <div className="historikk__innslag">
                <Element className="innslag__header">
                    <FormattedMessage id={innslagHeaderId} />
                </Element>
                {historikkdata()}
                <Undertekst>
                    <DatoEllerTidSiden>{dato}</DatoEllerTidSiden>
                    &nbsp;
                    {this.hentKomponentMedNavn()}
                </Undertekst>
            </div>
        );
    }
}

InnstillingHistorikkInnslag.defaultProps = {
    veileder: undefined,
};

InnstillingHistorikkInnslag.propTypes = {
    innstillingHistorikk: AppPT.innstillingHistorikk.isRequired,
    doHentVeileder: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
    veileder: AppPT.veileder,
    intl: intlShape.isRequired,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    historiskePerioder: PT.arrayOf(AppPT.oppfolgingsPeriode).isRequired,
};

const mapStateToProps = state => {
    let nesteFra = dateToISODate(new Date(0));
    return {
        veileder: state.data.veiledere.data,
        dialoger: selectAlleDialoger(state),
        historiskePerioder: selectHistoriskeOppfolgingsPerioder(state)
            .sort((a, b) => a.sluttDato.localeCompare(b.sluttDato))
            .map(periode => {
                const sluttDato = periode.sluttDato;
                const fra = nesteFra;
                nesteFra = sluttDato;
                return {
                    id: sluttDato,
                    til: sluttDato,
                    vistFra: periode.startDato,
                    fra,
                };
            })
            .reverse(),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentVeileder: veilederId => dispatch(hentVeileder(veilederId)),
    doVelgHistoriskPeriode: (historiskPeriode, dialogId) => {
        dispatch(velgHistoriskPeriode(historiskPeriode));
        history.push(`/dialog/${dialogId}`);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(InnstillingHistorikkInnslag)
);
