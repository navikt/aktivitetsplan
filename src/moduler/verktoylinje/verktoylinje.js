import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import {
    erPrivateBrukerSomSkalSkrusAv,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import {
    selectViserInneverendePeriode,
    selectViserHistoriskPeriode,
} from '../filtrering/filter/filter-selector';
import {
    selectErBruker,
    selectErVeileder,
} from '../identitet/identitet-selector';
import {
    selectErUnderOppfolging,
    selectHarSkriveTilgang,
} from '../oppfolging-status/oppfolging-selector';
import TallAlert from '../../felles-komponenter/tall-alert';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import NavigasjonslinjeKnapp from '../../hovedside/navigasjonslinje/navigasjonslinje-knapp';
import { selectDialoger } from '../../moduler/dialog/dialog-selector';
import { dialogFilter } from '../../moduler/filtrering/filter/filter-utils';
import {
    BRUKERVILKAR,
    harFeature,
} from '../../felles-komponenter/feature/feature';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import Lenke from '../../felles-komponenter/utils/lenke';

function Verktoylinje({
    viserHistoriskPeriode,
    privatModus,
    erVeileder,
    harSkriveTilgang,
    erPrivatBruker,
    features,
    disabled,
    antallUlesteDialoger,
    kanHaDialog,
    ikkeFinnesDialogerIHistoriskPeriode,
}) {
    return (
        <div className="verktoylinje">
            <div className="verktoylinje__verktoy-container">
                <HiddenIfDiv className="aktivitetskort__henvendelser">
                    <TallAlert hidden={antallUlesteDialoger <= 0}>
                        {antallUlesteDialoger}
                    </TallAlert>
                    <HiddenIfDiv
                        hidden={antallUlesteDialoger > 0}
                        className="sr-only"
                    >
                        <FormattedMessage id="aktivitetskort-dialog-tidligere-meldinger" />
                    </HiddenIfDiv>
                </HiddenIfDiv>
                <Lenke
                    href="/dialog"
                    className="knappelenke"
                    disabled={
                        disabled ||
                        !kanHaDialog ||
                        ikkeFinnesDialogerIHistoriskPeriode
                    }
                    aria-live="polite"
                >
                    <FormattedMessage id="navigasjon.dialog" />
                </Lenke>
                <Lenkeknapp
                    type="big-hoved"
                    href="/aktivitet/ny"
                    disabled={
                        viserHistoriskPeriode ||
                        privatModus ||
                        erPrivatBruker ||
                        !harSkriveTilgang
                    }
                >
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
            </div>
            <div className="verktoylinje__verktoy-container">
                <Lenke
                    sti="/informasjon"
                    className="knappelenke"
                    tekstId={
                        harFeature(BRUKERVILKAR, features)
                            ? 'navigasjon.informasjon'
                            : 'navigasjon.informasjonsvideo'
                    }
                    disabled={disabled}
                >
                    <FormattedMessage
                        id={
                            harFeature(BRUKERVILKAR, features)
                                ? 'navigasjon.informasjon'
                                : 'navigasjon.informasjonsvideo'
                        }
                    />
                </Lenke>
                <NavigasjonslinjeKnapp
                    ariaLabel="utskrift.ikon.alt.tekst"
                    lenke="/utskrift"
                    className="navigasjonslinje-meny__knapp--print navigasjonslinje-meny__knapp"
                />
                <PeriodeFilter
                    className="verktoylinje__verktoy"
                    skjulInneverende={privatModus && erVeileder}
                />
                <Filter
                    className="verktoylinje__verktoy"
                    skjulIPrivatModus={
                        !viserHistoriskPeriode && privatModus && erVeileder
                    }
                />
            </div>
        </div>
    );
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
    privatModus: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    erPrivatBruker: PT.bool.isRequired,
    features: PT.object.isRequired,
    disabled: PT.bool.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    kanHaDialog: PT.bool.isRequired,
    ikkeFinnesDialogerIHistoriskPeriode: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const dialoger = selectDialoger(state)
        .filter(d => !d.lest)
        .filter(d => dialogFilter(d, state)).length;
    const underOppfolging = selectErUnderOppfolging(state);
    const historiskPeriode = selectViserHistoriskPeriode(state);

    return {
        viserHistoriskPeriode: historiskPeriode,
        privatModus: selectErPrivatModus(state),
        erPrivatBruker: erPrivateBrukerSomSkalSkrusAv(state), // todo remove me
        erVeileder: selectErVeileder(state),
        harSkriveTilgang: selectHarSkriveTilgang(state),
        features: selectFeatureData(state),
        disabled:
            !selectErBruker(state) &&
            !underOppfolging &&
            selectViserInneverendePeriode(state),
        kanHaDialog: underOppfolging || historiskPeriode,
        antallUlesteDialoger: dialoger,
        ikkeFinnesDialogerIHistoriskPeriode:
            dialoger.length < 1 && !selectViserInneverendePeriode(state),
    };
};

export default connect(mapStateToProps)(Verktoylinje);
