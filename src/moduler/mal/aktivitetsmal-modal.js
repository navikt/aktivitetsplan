import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PT from 'prop-types';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';
import { LUKK_MODAL } from '../../felles-komponenter/modal/modal-reducer';
import * as AppPT from '../../proptypes';
import { formNavn } from './aktivitetsmal-form';

function MalModal({
    malFeilMeldinger,
    children,
    formIsDirty,
    intl,
    lukkModal,
    history,
}) {
    return (
        <Modal
            header={<ModalHeader className="aktivitetmal__modal" />}
            contentLabel="aktivitetsmal-modal"
            feilmeldinger={malFeilMeldinger}
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || window.confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
        >
            {children}
        </Modal>
    );
}

MalModal.propTypes = {
    malFeilMeldinger: PT.array,
    children: PT.node.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

MalModal.defaultProps = {
    malFeilMeldinger: [],
};

function AktivitetsmalModalHOC(Component) {
    return function inner(props) {
        return (
            <div>
                <MalModal {...props}>
                    <ModalContainer>
                        <Innholdstittel className="aktivitetmal__header">
                            <FormattedMessage id="aktivitetsmal.mitt-mal.header" />
                        </Innholdstittel>
                        <Component {...props} />
                    </ModalContainer>
                </MalModal>
            </div>
        );
    };
}

const mapStateToProps = state => ({
    malFeilMeldinger: selectMalListeFeilmeldinger(state),
    formIsDirty: isDirty(formNavn)(state),
});

const mapDispatchToProps = dispatch => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

const AktivitetsmalModal = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
    AktivitetsmalModalHOC
);

export default AktivitetsmalModal;
