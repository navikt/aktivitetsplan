import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Bilde from '../../felles-komponenter/bilde/bilde';
import {
    selectErBrukerIArbeidsliste,
    selectHarVeilederTilgang,
    selectIsOppfolgendeVeileder,
} from '../../moduler/arbeidsliste/arbeidsliste-selector';
import ArbeidslisteSVG from './arbeidsliste.svg';
import ArbeidslisteActiveSVG from './arbeidsliste-active.svg';
import HiddenIfHOC, {
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import Lenke from '../../felles-komponenter/utils/lenke';
import TildelVeileder from '../../moduler/tildel-veileder/tildel-veileder';

const NavigasjonsElement = HiddenIfHOC(({ sti, tekstId }) =>
    <Lenke href={sti} className="knappelenke">
        <FormattedMessage id={tekstId} />
    </Lenke>
);

function ArbeidslisteMeny({
    brukerErMin,
    kanLeggeTil,
    kanFjerne,
    kanRedigere,
    harVeilederTilgang,
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
            <NavigasjonsElement
                sti="/arbeidsliste/leggtil"
                tekstId="navigasjon.legg.i.arbeidsliste"
            />
        </span>
    );

    const FjernLenke = HiddenIfHOC(() =>
        <NavigasjonsElement
            disabled={!brukerErMin}
            sti="/arbeidsliste/fjern"
            tekstId="navigasjon.fjern.arbeidsliste"
        />
    );

    const RedigerLenke = HiddenIfHOC(() =>
        <NavigasjonsElement
            sti="/arbeidsliste/rediger"
            tekstId="navigasjon.vis.kommentarer"
            className="navigasjonslinje-meny__rediger-lenke"
        />
    );

    return (
        <HiddenIfDiv
            hidden={
                !kanLeggeTil &&
                !kanFjerne &&
                !kanRedigere &&
                !harVeilederTilgang
            }
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

ArbeidslisteMeny.propTypes = {
    brukerErMin: PT.bool.isRequired,
    kanRedigere: PT.bool.isRequired,
    kanLeggeTil: PT.bool.isRequired,
    kanFjerne: PT.bool.isRequired,
    harVeilederTilgang: PT.bool.isRequired,
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
        harVeilederTilgang,
    };
};

export default connect(mapStateToProps)(ArbeidslisteMeny);
