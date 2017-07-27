import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { slettArbeidsliste } from './arbeidsliste-reducer';
import { LUKK_MODAL } from '../../ducks/modal';

function FjernArbeidsliste({ navn, onClick, lukkModal }) {
    const fnr = getFodselsnummer();
    return (
        <article>
            <Innholdstittel className="arbeidsliste__overskrift">
                <FormattedMessage id="arbeidsliste.modal.fjern.overskrift" />
            </Innholdstittel>
            <Normaltekst>
                <FormattedMessage id="arbeidsliste.modal.fjern.infotekst" />
            </Normaltekst>
            <Undertittel>
                <FormattedMessage
                    id="arbeidsliste.modal.personalia"
                    values={{ navn, fnr }}
                />
            </Undertittel>
            <section className="arbeidsliste__skillelinje">
                <button
                    type="submit"
                    className="knapp knapp--hoved"
                    onClick={onClick}
                >
                    <FormattedMessage id="arbeidsliste.knapp.bekreft" />
                </button>
                <button type="button" className="knapp" onClick={lukkModal}>
                    <FormattedMessage id="arbeidsliste.knapp.avbryt" />
                </button>
            </section>
        </article>
    );
}

FjernArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
    onClick: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onClick: () => {
        dispatch(slettArbeidsliste(getFodselsnummer())).then(() =>
            history.push('/')
        );
    },
    lukkModal: () => {
        dispatch(LUKK_MODAL);
        return history.push('/');
    },
});

export default connect(null, mapDispatchToProps)(FjernArbeidsliste);
