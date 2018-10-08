import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import visibleIfHOC from '../../../../hocs/visible-if';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';

function AvtaltStripeKRRKvpManuellBruker({ brukerUtenAktivitesPlan }) {
    const brukerUtenAktivitetsPlanSelectValue = Object.entries(
        brukerUtenAktivitesPlan
    ).find(([key, value]) => value)[0]; // eslint-disable-line no-unused-vars
    return (
        <div className="avtalt-container__alertstripe">
            <AlertStripeInfo>
                <FormattedMessage
                    id="sett-avtalt-forhandsrientering-bruker-uten-aktivitesplan"
                    values={{
                        brukerUtenAktivitesplan: brukerUtenAktivitetsPlanSelectValue,
                    }}
                />
            </AlertStripeInfo>
        </div>
    );
}

AvtaltStripeKRRKvpManuellBruker.propTypes = {
    brukerUtenAktivitesPlan: PT.objectOf(PT.bool).isRequired,
};

const mapStateToProps = state => ({
    brukerUtenAktivitesPlan: {
        brukerErManuell: selectErBrukerManuell(state),
        brukerErUnderKvp: selectErUnderKvp(state),
        brukerErIReservasjonKRR: selectReservasjonKRR(state),
    },
});

export default visibleIfHOC(
    connect(mapStateToProps)(AvtaltStripeKRRKvpManuellBruker)
);
