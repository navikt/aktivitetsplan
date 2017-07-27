import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import history from '../../history';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { slettArbeidsliste } from './arbeidsliste-reducer';
import { LUKK_MODAL } from '../../ducks/modal';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

function FjernArbeidsliste({ navn, onClick, lukkModal }) {
    const fnr = getFodselsnummer();
    return (
        <section>
            <ModalContainer className="arbeidsliste__container">
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
            </ModalContainer>
            <ModalFooter>
                <button
                    type="submit"
                    className="knapp knapp--hoved"
                    onClick={() => {
                        onClick();
                        history.push('/');
                        lukkModal();
                    }}
                >
                    <FormattedMessage id="arbeidsliste.knapp.bekreft" />
                </button>
                <button
                    type="button"
                    className="knapp"
                    onClick={() => {
                        history.push('/');
                        lukkModal();
                    }}
                >
                    <FormattedMessage id="arbeidsliste.knapp.avbryt" />
                </button>
            </ModalFooter>
        </section>
    );
}

FjernArbeidsliste.propTypes = {
    navn: PT.string.isRequired,
    onClick: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onClick: () => dispatch(slettArbeidsliste(getFodselsnummer())),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

export default connect(null, mapDispatchToProps)(FjernArbeidsliste);
