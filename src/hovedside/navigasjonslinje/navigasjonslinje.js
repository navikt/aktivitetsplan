import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classNames from 'classnames';
import NavigasjonslinjeMeny from './navigasjonslinjemeny';
import Lenke from '../../felles-komponenter/utils/lenke';
import ConfigToggle, {
    harConfigToggle,
} from '../../felles-komponenter/feature/config-toggle';
import { hentDialog } from '../../moduler/dialog/dialog-reducer';
import { dialogFilter } from '../../moduler/filtrering/filter/filter-utils';
import { hentArbeidsliste } from '../../moduler/arbeidsliste/arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectArbeidslisteStatus } from '../../moduler/arbeidsliste/arbeidsliste-selector';
import * as AppPT from '../../proptypes';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from '../../moduler/oppfolging-status/oppfolging-selector';
import { selectErBruker } from '../../moduler/identitet/identitet-selector';
import {
    selectViserHistoriskPeriode,
    selectViserInneverendePeriode,
} from '../../moduler/filtrering/filter/filter-selector';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import { selectDialoger } from '../../moduler/dialog/dialog-selector';
import NavigasjonslinjeKnapp from './navigasjonslinje-knapp';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import { selectTildelVeilederStatus } from '../../moduler/tildel-veileder/tildel-veileder-selector';
import Feature, { NY_LAYOUT } from '../../felles-komponenter/feature/feature';

export const NavigasjonsElement = hiddenIf(
    ({ sti, tekstId, disabled, children }) => {
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
    }
);

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

class Navigasjonslinje extends Component {
    componentDidMount() {
        const { doHentDialog, doHentArbeidsliste } = this.props;
        doHentDialog();
        if (harConfigToggle(navigasjonslinjemenyFeature)) {
            doHentArbeidsliste(getFodselsnummer());
        }
    }

    render() {
        const { avhengigheter } = this.props;

        return (
            <Feature name={NY_LAYOUT} reverse>
                <ConfigToggle name={navigasjonslinjemenyFeature}>
                    <div className="container-navigasjonslinje">
                        <nav className="navigasjonslinje">
                            <div className="navigasjonslinje__verktoy">
                                <Innholdslaster
                                    avhengigheter={avhengigheter}
                                    spinnerStorrelse="XS"
                                    className="navigasjonslinje__spinner"
                                    alleOK
                                >
                                    <NavigasjonslinjeMeny />
                                </Innholdslaster>
                                <NavigasjonslinjeKnapp
                                    ariaLabel="navigasjon.innstillinger"
                                    lenke="/innstillinger"
                                    className="navigasjonslinje-meny__knapp--innstillinger navigasjonslinje-meny__knapp"
                                />
                            </div>
                        </nav>
                    </div>
                </ConfigToggle>
            </Feature>
        );
    }
}

Navigasjonslinje.propTypes = {
    doHentDialog: PT.func.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    doHentArbeidsliste: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    kanHaDialog: PT.bool.isRequired,
    ikkeFinnesDialogerIHistoriskPeriode: PT.bool.isRequired,
};

Navigasjonslinje.defaultProps = {
    erBruker: true,
};

const mapStateToProps = state => {
    const dialoger = selectDialoger(state);
    const antallUlesteDialoger = dialoger
        .filter(d => !d.lest)
        .filter(d => dialogFilter(d, state)).length;
    const underOppfolging = selectErUnderOppfolging(state);
    const erIkkeBruker = !selectErBruker(state);

    return {
        antallUlesteDialoger,
        underOppfolging,
        avhengigheter: [
            selectArbeidslisteStatus(state),
            selectTildelVeilederStatus(state),
            selectOppfolgingStatus(state),
        ],
        kanHaDialog: underOppfolging || selectViserHistoriskPeriode(state),
        disabled:
            erIkkeBruker &&
            !underOppfolging &&
            selectViserInneverendePeriode(state),
        ikkeFinnesDialogerIHistoriskPeriode:
            dialoger.length < 1 && !selectViserInneverendePeriode(state),
        features: selectFeatureData(state),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
    doHentArbeidsliste: fnr => dispatch(hentArbeidsliste(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
