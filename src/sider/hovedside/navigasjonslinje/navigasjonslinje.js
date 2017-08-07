import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classNames from 'classnames';
import NavigasjonslinjeMeny from './navigasjonslinje-meny';
import Lenke from '../../../felles-komponenter/utils/lenke';
import Feature from '../../../felles-komponenter/feature/feature';
import TallAlert from '../../../felles-komponenter/tall-alert';
import { hentDialog } from '../../../ducks/dialog';
import { dialogFilter } from '../../../moduler/filter/filter-utils';
import { hentArbeidsliste } from '../../../moduler/arbeidsliste/arbeidsliste-reducer';
import { getFodselsnummer } from '../../../bootstrap/fnr-util';
import { selectErPrivatModus } from '../../../moduler/privat-modus/privat-modus-selector';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    selectHarVeilederTilgang,
    selectArbeidslisteReducer,
} from '../../../moduler/arbeidsliste/arbeidsliste-selector';
import * as AppPT from '../../../proptypes';
import { selectErUnderOppfolging } from '../../../moduler/situasjon/situasjon-selector';
import { selectErBruker } from '../../../moduler/identitet/identitet-duck';
import { selectViserInneverendePeriode } from '../../../moduler/filter/filter-selector';

const NavigasjonsElement = ({ sti, tekstId, disabled, children }) => {
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
};

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

class Navigasjonslinje extends Component {
    componentDidMount() {
        this.props.doHentDialog();
        this.props.doHentArbeidsliste(getFodselsnummer());
    }

    render() {
        const {
            antallUlesteDialoger,
            arbeidslisteReducer,
            harVeilederTilgang,
            disabled,
        } = this.props;
        return (
            <nav className="navigasjonslinje">
                <NavigasjonsElement
                    sti="/dialog"
                    tekstId="navigasjon.dialog"
                    disabled={disabled}
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
                    disabled={disabled}
                />
                <Feature name="navigasjonslinjemeny">
                    <Innholdslaster
                        avhengigheter={[arbeidslisteReducer]}
                        spinnerStorrelse="xs"
                    >
                        <NavigasjonslinjeMeny
                            harVeilederTilgang={harVeilederTilgang}
                        />
                    </Innholdslaster>
                </Feature>
            </nav>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    doHentArbeidsliste: PT.func.isRequired,
    arbeidslisteReducer: AppPT.reducer.isRequired,
    harVeilederTilgang: PT.bool,
    disabled: PT.bool.isRequired,
};

Navigasjonslinje.defaultProps = {
    harVeilederTilgang: false,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const dialog = stateData.dialog.data;
    const underOppfolging = selectErUnderOppfolging(state);
    return {
        antallUlesteDialoger: dialog
            .filter(d => !d.lest)
            .filter(d => dialogFilter(d, state)).length,
        privatModus: selectErPrivatModus(state),
        underOppfolging: stateData.situasjon.data.underOppfolging,
        arbeidslisteReducer: selectArbeidslisteReducer(state),
        harVeilederTilgang: selectHarVeilederTilgang(state),
        disabled:
            !selectErBruker(state) &&
            underOppfolging === false &&
            selectViserInneverendePeriode(state),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
    doHentArbeidsliste: fnr => dispatch(hentArbeidsliste(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
