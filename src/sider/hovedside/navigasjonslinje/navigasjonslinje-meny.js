import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Bilde from '../../../felles-komponenter/bilde/bilde';
import history from '../../../history';
import {
    selectErBrukerIArbeidsliste,
    selectHarVeilederTilgang,
    selectIsOppfolgendeVeileder,
} from '../../../moduler/arbeidsliste/arbeidsliste-selector';
import ArbeidslisteSVG from './arbeidsliste.svg';
import ArbeidslisteActiveSVG from './arbeidsliste-active.svg';
import Knappelenke from '../../../felles-komponenter/utils/knappelenke';
import HiddenIfHOC from '../../../felles-komponenter/hidden-if/hidden-if';

function NavigasjonslinjeMeny({
    brukerErMin,
    kanLeggeTil,
    kanFjerne,
    kanRedigere,
}) {
    const LeggTilLenke = HiddenIfHOC(() =>
        <span>
            <Bilde
                className="arbeidsliste-flagg"
                src={ArbeidslisteSVG}
                alt="arbeidsliste.icon.alt.tekst"
            />
            <Knappelenke
                className="navigasjonslinje__button"
                disabled={!brukerErMin}
                onClick={() => history.push('arbeidsliste/leggtil')}
            >
                <FormattedMessage id="navigasjon.legg.i.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const FjernLenke = HiddenIfHOC(() =>
        <span>
            <span className="navigasjonslinje-meny__fjern">
                <Bilde
                    className="arbeidsliste-flagg"
                    src={ArbeidslisteActiveSVG}
                    alt="arbeidsliste.icon.alt.tekst"
                />
                <FormattedMessage id="navigasjon.i.arbeidsliste" />
            </span>
            <Knappelenke
                className="navigasjonslinje__button"
                disabled={!brukerErMin}
                onClick={() => history.push('arbeidsliste/fjern')}
            >
                <FormattedMessage id="navigasjon.fjern.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const RedigerLenke = HiddenIfHOC(() =>
        <Knappelenke
            className="navigasjonslinje__button"
            onClick={() => history.push('arbeidsliste/rediger')}
        >
            <FormattedMessage id="navigasjon.vis.kommentarer" />
        </Knappelenke>
    );

    return (
        <div className="navigasjonslinje-meny">
            <LeggTilLenke hidden={!kanLeggeTil} />
            <FjernLenke hidden={!kanFjerne} />
            <RedigerLenke hidden={!kanRedigere} />
        </div>
    );
}

NavigasjonslinjeMeny.propTypes = {
    brukerErMin: PT.bool.isRequired,
    kanRedigere: PT.bool.isRequired,
    kanLeggeTil: PT.bool.isRequired,
    kanFjerne: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const brukerErIArbeidsliste = selectErBrukerIArbeidsliste(state);
    const brukerErMin = selectIsOppfolgendeVeileder(state);
    const harVeilederTilgang = selectHarVeilederTilgang(state);

    const kanLeggeTil =
        !brukerErIArbeidsliste && harVeilederTilgang && brukerErMin;
    const kanFjerne =
        brukerErIArbeidsliste && harVeilederTilgang && brukerErMin;
    const kanRedigere = brukerErIArbeidsliste && harVeilederTilgang;
    return {
        brukerErMin,
        kanLeggeTil,
        kanFjerne,
        kanRedigere,
    };
};

export default connect(mapStateToProps)(NavigasjonslinjeMeny);
