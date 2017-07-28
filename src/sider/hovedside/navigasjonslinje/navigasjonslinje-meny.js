import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import history from '../../../history';
import { HiddenIfKnappelenke } from '../../../felles-komponenter/hidden-if/hidden-if-knapp-lenke';
import { brukerTilhorerVeileder } from '../../../moduler/situasjon/situasjon-selector';
import { erBrukerIArbeidsliste } from '../../../moduler/arbeidsliste/arbeidsliste-selector';

function NavigasjonslinjeMeny({ intl, brukerErMin, brukerErIArbeidsliste }) {
    const InnstillingerKnapp = () =>
        <button
            className="navigasjonslinje-meny__innstillinger-knapp"
            aria-label={intl.formatMessage({
                id: 'navigasjon.innstillinger',
            })}
            onClick={() => history.push('/innstillinger')}
        />;

    const LeggTilKnapp = () =>
        <HiddenIfKnappelenke
            hidden={!brukerErMin || brukerErIArbeidsliste}
            className="navigasjonslinje__skillestrek"
            onClick={() => history.push('arbeidsliste/leggtil')}
        >
            <FormattedMessage id="navigasjon.legg.i.arbeidsliste" />
        </HiddenIfKnappelenke>;

    const FjernKnapp = () =>
        <HiddenIfKnappelenke
            hidden={!brukerErIArbeidsliste}
            className="navigasjonslinje__skillestrek"
            disabled={!brukerErMin}
            onClick={() => history.push('arbeidsliste/fjern')}
        >
            <FormattedMessage id="navigasjon.fjern.arbeidsliste" />
        </HiddenIfKnappelenke>;

    const RedigerKnapp = () =>
        <HiddenIfKnappelenke
            hidden={!brukerErIArbeidsliste}
            className="navigasjonslinje__skillestrek"
            onClick={() => history.push('arbeidsliste/rediger')}
        >
            <FormattedMessage id="navigasjon.vis.kommentarer" />
        </HiddenIfKnappelenke>;

    return (
        <div className="navigasjonslinje-meny">
            <LeggTilKnapp />
            <FjernKnapp />
            <RedigerKnapp />
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
