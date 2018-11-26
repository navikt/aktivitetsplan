import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PT from 'prop-types';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';

function MalModal({ malFeilMeldinger, children }) {
    return (
        <Modal
            header={<ModalHeader className="aktivitetmal__modal" />}
            contentLabel="aktivitetsmal-modal"
            feilmeldinger={malFeilMeldinger}
        >
            {children}
        </Modal>
    );
}

MalModal.propTypes = {
    malFeilMeldinger: PT.array,
    children: PT.node.isRequired,
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
});

const AktivitetsmalModal = compose(
    connect(mapStateToProps),
    AktivitetsmalModalHOC
);

export default AktivitetsmalModal;
