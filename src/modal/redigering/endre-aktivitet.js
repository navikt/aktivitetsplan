import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import { SKJUL_VERSJONSKONFLIKT_ACTION } from '../../ducks/endre-aktivitet';
import * as AppPT from '../../proptypes';
import ModalHeader from '../modal-header';
import StillingAktivitetForm, { formNavn as stillingFormNavn } from '../skjema/stilling-aktivitet-form';
import EgenAktivitetForm, { formNavn as egenFormNavn } from '../skjema/egen-aktivitet-form';
import history from '../../history';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE } from '../../constant';
import ModalContainer from '../modal-container';
import Versjonskonflikt from './versjonskonflikt';
import Modal from '../modal';
import { LUKK_MODAL } from '../../ducks/modal';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

function EndreAktivitet({ aktivitet, doOppdaterAktivitet, visVersjonskonflikt, skjulVersjonskonflikt, intl, lukkModal, formIsDirty, aktiviteter }) {
    function visAktivitet() {
        history.push(`aktivitet/aktivitet/${aktivitet.id}`);
        skjulVersjonskonflikt();
    }

    function renderForm() {
        function oppdater(aktivitetData) {
            const oppdatertAktivitet = { ...aktivitet, ...aktivitetData };
            doOppdaterAktivitet(oppdatertAktivitet).then(visAktivitet);
        }

        switch (aktivitet.type) {
            case STILLING_AKTIVITET_TYPE:
                return <StillingAktivitetForm aktivitet={aktivitet} onSubmit={oppdater} />;
            case EGEN_AKTIVITET_TYPE:
                return <EgenAktivitetForm aktivitet={aktivitet} onSubmit={oppdater} />;
            default:
                return null;
        }
    }

    return (
        <Modal
            isOpen
            key="endreAktivitetModal"
            onRequestClose={
                () => {
                    const dialogTekst = intl.formatMessage({ id: 'aktkivitet-skjema.lukk-advarsel' });
                    if (!formIsDirty || confirm(dialogTekst)) { // eslint-disable-line no-alert
                        history.push('/');
                        lukkModal();
                    }
                }
            }
            contentLabel="aktivitet-modal"
        >
            <article className="egen-aktivitet" aria-labelledby="modal-egen-aktivitet-header">
                <ModalHeader tilbakeTekstId="endre-aktivitet.tilbake" visConfirmDialog={formIsDirty} />
                <Innholdslaster avhengigheter={[aktiviteter]}>
                    <ModalContainer>
                        <Versjonskonflikt visible={visVersjonskonflikt} tilbake={skjulVersjonskonflikt} slett={visAktivitet} />
                        <div className={visVersjonskonflikt && 'hidden'}>{renderForm()}</div>
                    </ModalContainer>
                </Innholdslaster>
            </article>
        </Modal>
    );
}


EndreAktivitet.propTypes = {
    doOppdaterAktivitet: PT.func.isRequired,
    visVersjonskonflikt: PT.bool.isRequired,
    skjulVersjonskonflikt: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    aktiviteter: PT.shape({
        status: PT.string.isRequired
    }).isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired
};

EndreAktivitet.defaultProps = {
    aktivitet: {}
};

const mapStateToProps = (state, props) => {
    const id = props.params.id;
    const aktivitet = state.data.aktiviteter.data.find((a) => a.id === id) || {};
    const formNavn = aktivitet.type === STILLING_AKTIVITET_TYPE ? stillingFormNavn : egenFormNavn;
    return {
        aktivitet,
        aktiviteter: state.data.aktiviteter,
        visVersjonskonflikt: state.view.endreAktivitet.visVersjonskonflikt,
        formIsDirty: isDirty(formNavn)(state)
    };
};

const mapDispatchToProps = (dispatch) => ({
    doOppdaterAktivitet: (aktivitet) => oppdaterAktivitet(aktivitet)(dispatch),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
    skjulVersjonskonflikt: () => dispatch(SKJUL_VERSJONSKONFLIKT_ACTION)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EndreAktivitet));
