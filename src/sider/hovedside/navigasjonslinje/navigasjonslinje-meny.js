import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Bilde } from 'nav-react-design';
import history from '../../../history';
import { brukerTilhorerVeileder } from '../../../moduler/situasjon/situasjon-selector';
import { erBrukerIArbeidsliste } from '../../../moduler/arbeidsliste/arbeidsliste-selector';
import ArbeidslisteSVG from './arbeidsliste.svg';
import ArbeidslisteActiveSVG from './arbeidsliste-active.svg';
import Knappelenke from '../../../felles-komponenter/utils/knappelenke';
import HiddenIfHOC from '../../../felles-komponenter/hidden-if/hidden-if';

function NavigasjonslinjeMeny({ intl, brukerErMin, brukerErIArbeidsliste }) {
    const InnstillingerKnapp = () =>
        <button
            className="navigasjonslinje-meny__innstillinger-knapp"
            aria-label={intl.formatMessage({
                id: 'navigasjon.innstillinger',
            })}
            onClick={() => history.push('/innstillinger')}
        />;

    const LeggTilKnapp = HiddenIfHOC(() =>
        <span>
            <Bilde
                className="arbeidsliste-flagg"
                src={ArbeidslisteSVG}
                alt="arbeidsliste.icon.alt.tekst"
            />
            <Knappelenke
                className="navigasjonslinje__skillestrek"
                onClick={() => history.push('arbeidsliste/leggtil')}
            >
                <FormattedMessage id="navigasjon.legg.i.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const FjernKnapp = HiddenIfHOC(() =>
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
                className="navigasjonslinje__skillestrek"
                disabled={!brukerErMin}
                onClick={() => history.push('arbeidsliste/fjern')}
            >
                <FormattedMessage id="navigasjon.fjern.arbeidsliste" />
            </Knappelenke>
        </span>
    );

    const RedigerKnapp = HiddenIfHOC(() =>
        <Knappelenke
            className="navigasjonslinje__skillestrek"
            onClick={() => history.push('arbeidsliste/rediger')}
        >
            <FormattedMessage id="navigasjon.vis.kommentarer" />
        </Knappelenke>
    );

    return (
        <div className="navigasjonslinje-meny">
            <LeggTilKnapp hidden={!brukerErMin || brukerErIArbeidsliste} />
            <FjernKnapp hidden={!brukerErIArbeidsliste} />
            <RedigerKnapp hidden={!brukerErIArbeidsliste} />
            <InnstillingerKnapp />
        </div>
    );
}

NavigasjonslinjeMeny.propTypes = {
    intl: intlShape.isRequired,
    brukerErMin: PT.bool.isRequired,
    brukerErIArbeidsliste: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    brukerErMin: brukerTilhorerVeileder(state),
    brukerErIArbeidsliste: erBrukerIArbeidsliste(state),
});

export default connect(mapStateToProps)(injectIntl(NavigasjonslinjeMeny));
