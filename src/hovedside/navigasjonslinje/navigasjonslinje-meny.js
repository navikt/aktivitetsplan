import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Bilde from '../../felles-komponenter/bilde/bilde';
import history from '../../history';
import {
    selectErBrukerIArbeidsliste,
    selectHarVeilederTilgang,
    selectIsOppfolgendeVeileder,
} from '../../moduler/arbeidsliste/arbeidsliste-selector';
import ArbeidslisteSVG from './arbeidsliste.svg';
import ArbeidslisteActiveSVG from './arbeidsliste-active.svg';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import HiddenIfHOC, {
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import TildelVeileder from '../../moduler/tildel-veileder/tildel-veileder';

function NavigasjonslinjeMeny({
    brukerErMin,
    kanLeggeTil,
    kanFjerne,
    kanRedigere,
}) {
    const Arbeidslisteikon = ({ fyldt }) =>
        <FormattedMessage id="arbeidsliste.flaggikon" values={{ fyldt }}>
            {altTekst =>
                <Bilde
                    className="navigasjonslinje-meny__arbeidsliste-flagg"
                    src={fyldt ? ArbeidslisteActiveSVG : ArbeidslisteSVG}
                    alt={altTekst}
                />}
        </FormattedMessage>;

    Arbeidslisteikon.propTypes = {
        fyldt: PT.bool.isRequired,
    };

    const HiddenArbeidslisteikon = HiddenIfHOC(() =>
        <Arbeidslisteikon fyldt />
    );

    const LeggTilLenke = HiddenIfHOC(() =>
        <span>
            <Arbeidslisteikon fyldt={false} />
            <Knappelenke
                disabled={!brukerErMin}
                onClick={() => history.push('arbeidsliste/leggtil')}
            >
                <FormattedMessage id="navigasjon.legg.i.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const FjernLenke = HiddenIfHOC(() =>
        <span>
            <Knappelenke
                disabled={!brukerErMin}
                onClick={() => history.push('arbeidsliste/fjern')}
            >
                <FormattedMessage id="navigasjon.fjern.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const RedigerLenke = HiddenIfHOC(() =>
        <span>
            <Knappelenke
                className="navigasjonslinje-meny__rediger-lenke"
                onClick={() => history.push('arbeidsliste/rediger')}
            >
                <FormattedMessage id="navigasjon.vis.kommentarer" />
            </Knappelenke>
        </span>
    );

    return (
        <HiddenIfDiv
            hidden={!kanLeggeTil && !kanFjerne && !kanRedigere}
            className="navigasjonslinje-meny"
        >
            <HiddenArbeidslisteikon hidden={!kanRedigere} />
            <LeggTilLenke hidden={!kanLeggeTil} />
            <FjernLenke hidden={!kanFjerne} />
            <HiddenIfDiv
                hidden={!kanFjerne && !kanLeggeTil}
                className="navigasjonslinje-meny__skillelinje"
            />
            <RedigerLenke hidden={!kanRedigere} />
            <HiddenIfDiv
                hidden={!kanRedigere}
                className="navigasjonslinje-meny__skillelinje"
            />
            <TildelVeileder />
            <i className="navigasjonslinje-meny__skillelinje" />
        </HiddenIfDiv>
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
