import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { DatoEllerTidSiden } from '../../../felles-komponenter/dato';
import { hentVeileder } from '../../../ducks/veileder';
import * as AppPT from '../../../proptypes';

const NAV = 'NAV';
const SYSTEM = 'SYSTEM';
const EKSTERN = 'EKSTERN';

class InnstillingHistorikkInnslag extends Component {
    componentWillMount() {
        if (this.props.manuellHistorikk.opprettetAv === NAV) {
            this.props.doHentVeileder(
                this.props.manuellHistorikk.opprettetAvBrukerId
            );
        }
    }

    hentKomponentMedNavn() {
        const {
            opprettetAv,
            opprettetAvBrukerId,
        } = this.props.manuellHistorikk;
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
        const { manuell, dato, begrunnelse } = this.props.manuellHistorikk;
        const innslagHeaderId = manuell
            ? 'innstillinger.historikk.innslag.satt-til-manuell'
            : 'innstillinger.historikk.innslag.satt-til-digital';

        return (
            <div className="historikk__innslag">
                <Element className="innslag__header">
                    <FormattedMessage id={innslagHeaderId} />
                </Element>
                <Normaltekst className="innslag__begrunnelse">
                    <FormattedMessage
                        id="innstillinger.historikk.innslag.begrunnelse"
                        values={{ begrunnelse }}
                    />
                </Normaltekst>
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
    doHentVeileder: undefined,
    veileder: undefined,
};

InnstillingHistorikkInnslag.propTypes = {
    manuellHistorikk: AppPT.manuellHistorikk.isRequired,
    doHentVeileder: PT.func.isRequired,
    veileder: AppPT.veileder,
};

const mapStateToProps = state => ({
    veileder: state.data.veiledere.data,
});

const mapDispatchToProps = dispatch => ({
    doHentVeileder: veilederId => dispatch(hentVeileder(veilederId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    InnstillingHistorikkInnslag
);
