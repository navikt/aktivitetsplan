import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classNames from 'classnames';
import NavigasjonslinjeMeny from './navigasjonslinje-meny';
import Lenke from '../../../felles-komponenter/utils/lenke';
import Feature, {
    harFeature,
} from '../../../felles-komponenter/feature/feature';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { hentDialog } from '../../../ducks/dialog';
import { dialogFilter } from '../../../moduler/filtrering/filter/filter-utils';
import { hentArbeidsliste } from '../../../moduler/arbeidsliste/arbeidsliste-reducer';
import { getFodselsnummer } from '../../../bootstrap/fnr-util';
import { selectErPrivatModus } from '../../../moduler/privat-modus/privat-modus-selector';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    selectHarVeilederTilgang,
    selectArbeidslisteReducer,
} from '../../../moduler/arbeidsliste/arbeidsliste-selector';
import * as AppPT from '../../../proptypes';
import {
    selectErUnderOppfolging,
    selectVilkarMaBesvares,
} from '../../../moduler/situasjon/situasjon-selector';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';
import {
    selectViserHistoriskPeriode,
    selectViserInneverendePeriode,
} from '../../../moduler/filtrering/filter/filter-selector';
import hiddenIf from '../../../felles-komponenter/hidden-if/hidden-if';
import history from '../../../history';
import { selectDialoger } from '../../../moduler/dialog/dialog-selector';

const NavigasjonsElement = hiddenIf(({ sti, tekstId, disabled, children }) => {
    const elementKlasser = classNames({
        navigasjonslinje__element: !disabled,
        'navigasjonslinje__lenke--disabled': disabled,
    });
    const element = (
        <Element className={elementKlasser}>
            <FormattedMessage id={tekstId} />
            <span className="navigasjonslinje__element-content">
                {children}
            </span>
        </Element>
    );

    if (disabled) {
        return element;
    }

    return (
        <Lenke href={sti} className="navigasjonslinje__lenke">
            {element}
        </Lenke>
    );
});

NavigasjonsElement.defaultProps = {
    children: null,
    disabled: false,
};

NavigasjonsElement.propTypes = {
    sti: PT.string.isRequired,
    tekstId: PT.string.isRequired,
    children: PT.node,
    disabled: PT.bool,
};

const navigasjonslinjemenyFeature = 'navigasjonslinjemeny';

const PrintLenke = () =>
    <FormattedMessage id="utskrift.ikon.alt.tekst">
        {tekst =>
            <button
                aria-label={tekst}
                className="navigasjonslinje__button navigasjonslinje__button--print"
                onClick={() => history.push('/utskrift')}
            />}
    </FormattedMessage>;

const InnstillingerKnapp = () =>
    <FormattedMessage id="navigasjon.innstillinger">
        {label =>
            <button
                className="navigasjonslinje__button navigasjonslinje-meny__innstillinger-knapp"
                aria-label={label}
                onClick={() => history.push('/innstillinger')}
            />}
    </FormattedMessage>;

class Navigasjonslinje extends Component {
    componentDidMount() {
        const { doHentDialog, doHentArbeidsliste } = this.props;
        doHentDialog();
        if (harFeature(navigasjonslinjemenyFeature)) {
            doHentArbeidsliste(getFodselsnummer());
        }
    }

    render() {
        const {
            antallUlesteDialoger,
            arbeidslisteReducer,
            harVeilederTilgangTilArbeidsliste,
            disabled,
            kanHaDialog,
            ikkeTilgangTilVilkar,
        } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement
                    sti="/dialog"
                    tekstId="navigasjon.dialog"
                    disabled={disabled || !kanHaDialog}
                >
                    <TallAlert hidden={antallUlesteDialoger <= 0}>
                        {antallUlesteDialoger}
                    </TallAlert>
                </NavigasjonsElement>
                <NavigasjonsElement
                    sti="/mal"
                    tekstId="aktivitetsmal.mitt-mal"
                    disabled={disabled}
                />
                <NavigasjonsElement
                    sti="/vilkar"
                    tekstId="navigasjon.vilkar"
                    disabled={disabled || ikkeTilgangTilVilkar}
                />
                <NavigasjonsElement
                    sti="/informasjon"
                    tekstId="navigasjon.informasjon"
                    disabled={disabled}
                />
                <div className="navigasjonslinje__verktoy">
                    <Feature name={navigasjonslinjemenyFeature}>
                        <Innholdslaster
                            avhengigheter={[arbeidslisteReducer]}
                            spinnerStorrelse="xs"
                            className="navigasjonslinje__spinner"
                        >
                            <NavigasjonslinjeMeny
                                harVeilederTilgangTilArbeidsliste={
                                    harVeilederTilgangTilArbeidsliste
                                }
                            />
                        </Innholdslaster>
                    </Feature>

                    <PrintLenke />

                    <Feature name={navigasjonslinjemenyFeature}>
                        <InnstillingerKnapp />
                    </Feature>
                </div>
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    doHentArbeidsliste: PT.func.isRequired,
    arbeidslisteReducer: AppPT.reducer.isRequired,
    kanHaDialog: PT.bool.isRequired,
    harVeilederTilgangTilArbeidsliste: PT.bool,
    disabled: PT.bool.isRequired,
    ikkeTilgangTilVilkar: PT.bool.isRequired,
};

Navigasjonslinje.defaultProps = {
    harVeilederTilgangTilArbeidsliste: false,
    vilkarMaBesvares: true,
    erBruker: true,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const dialog = selectDialoger(state);
    const underOppfolging = selectErUnderOppfolging(state);
    const erIkkeBruker = !selectErBruker(state);

    // det gir ikke mening å vise vilkår til ikke-brukere (typisk veiledere) hvis bruker ikke har besvart vilkår for inneværende periode
    const ikkeTilgangTilVilkar =
        erIkkeBruker &&
        selectVilkarMaBesvares(state) &&
        selectViserInneverendePeriode(state);
    return {
        antallUlesteDialoger: dialog
            .filter(d => !d.lest)
            .filter(d => dialogFilter(d, state)).length,
        privatModus: selectErPrivatModus(state),
        underOppfolging: stateData.situasjon.data.underOppfolging,
        arbeidslisteReducer: selectArbeidslisteReducer(state),
        harVeilederTilgangTilArbeidsliste: selectHarVeilederTilgang(state),
        kanHaDialog: underOppfolging || selectViserHistoriskPeriode(state),
        ikkeTilgangTilVilkar,
        disabled:
            erIkkeBruker &&
            underOppfolging === false &&
            selectViserInneverendePeriode(state),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
    doHentArbeidsliste: fnr => dispatch(hentArbeidsliste(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
