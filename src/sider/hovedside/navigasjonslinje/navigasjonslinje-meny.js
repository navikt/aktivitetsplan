import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import history from '../../../history';
import { HiddenIfKnappelenke } from '../../../felles-komponenter/hidden-if/hidden-if-knapp-lenke';
import { isOppfolgendeVeileder } from '../../../moduler/arbeidsliste/arbeidsliste-selector';

function NavigasjonslinjeMeny({ intl, erGjeldendeVeileder }) {
    return (
        <div className="navigasjonslinje-meny">
            <HiddenIfKnappelenke
                hidden={true || !erGjeldendeVeileder}
                onClick={() => history.push('arbeidsliste/leggtil')}
            >
                <FormattedMessage id="navigasjon.legg.i.arbeidsliste" />
            </HiddenIfKnappelenke>
            <button
                className="navigasjonslinje-meny__innstillinger-knapp"
                aria-label={intl.formatMessage({
                    id: 'navigasjon.innstillinger',
                })}
                onClick={() => history.push('/innstillinger')}
            />
        </div>
    );
}

NavigasjonslinjeMeny.propTypes = {
    intl: intlShape.isRequired,
    erGjeldendeVeileder: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erGjeldendeVeileder: isOppfolgendeVeileder(state),
});

export default connect(mapStateToProps)(injectIntl(NavigasjonslinjeMeny));
