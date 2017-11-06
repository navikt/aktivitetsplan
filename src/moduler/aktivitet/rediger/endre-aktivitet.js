import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import { oppdaterAktivitet } from '../aktivitet-actions';
import * as AppPT from '../../../proptypes';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import history from '../../../history';
import { formNavn } from '../aktivitet-forms/aktivitet-form-utils';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import Modal from '../../../felles-komponenter/modal/modal';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { aktivitetRoute } from '../../../routing';
import { STATUS } from '../../../ducks/utils';
import { selectAktivitetMedId } from '../aktivitetliste-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';
import EndreAktivitetForm from './endre-aktivitet-form';

function EndreAktivitet({
    valgtAktivitet,
    intl,
    lukkModal,
    formIsDirty,
    avhengigheter,
    ...rest
}) {
    function visAktivitet() {
        history.push(aktivitetRoute(valgtAktivitet.id));
    }

    return (
        <Modal
            key="endreAktivitetModal"
            header={
                <ModalHeader
                    tilbakeTekstId="endre-aktivitet.tilbake"
                    visConfirmDialog={formIsDirty}
                />
            }
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            contentLabel="aktivitet-modal"
        >
            <article
                className="egen-aktivitet"
                aria-labelledby="modal-egen-aktivitet-header"
            >
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>
                        <EndreAktivitetForm
                            valgtAktivitet={valgtAktivitet}
                            visAktivitet={visAktivitet}
                            {...rest}
                        />
                    </ModalContainer>
                </Innholdslaster>
            </article>
        </Modal>
    );
}

EndreAktivitet.defaultProps = {
    valgtAktivitet: undefined,
};

EndreAktivitet.propTypes = {
    doOppdaterAktivitet: PT.func.isRequired,
    lagrer: PT.bool.isRequired,
    valgtAktivitet: AppPT.aktivitet,
    aktivitetId: PT.string.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    return {
        valgtAktivitet,
        avhengigheter: [valgtAktivitet ? STATUS.OK : STATUS.PENDING],
        formIsDirty: isDirty(formNavn)(state),
        lagrer: selectAktivitetStatus(state) !== STATUS.OK,
    };
};

const mapDispatchToProps = dispatch => ({
    doOppdaterAktivitet: aktivitet => oppdaterAktivitet(aktivitet)(dispatch),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(EndreAktivitet)
);
