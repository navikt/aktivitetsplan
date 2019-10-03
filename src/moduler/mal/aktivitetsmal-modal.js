import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';
import * as AppPT from '../../proptypes';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';

function MalModal({ malFeilMeldinger, children, history }) {
    return (
        <Modal
            header={<ModalHeader className="aktivitetmal__modal" />}
            contentLabel="aktivitetsmal-modal"
            feilmeldinger={malFeilMeldinger}
            onRequestClose={() => {
                history.push('/');
            }}
        >
            {children}
        </Modal>
    );
}

MalModal.propTypes = {
    malFeilMeldinger: PT.array,
    children: PT.node.isRequired,
    history: AppPT.history.isRequired,
    viserHistoriskPeriode: PT.bool.isRequired
};

MalModal.defaultProps = {
    malFeilMeldinger: []
};

function AktivitetsmalModalHOC(Component) {
    return function inner(props) {
        const { viserHistoriskPeriode } = props;
        return (
            <div>
                <MalModal {...props}>
                    <ModalContainer>
                        <Innholdstittel className="aktivitetmal__header">
                            {viserHistoriskPeriode ? 'Mål fra en tidligere periode' : 'Mitt mål'}
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
    viserHistoriskPeriode: selectViserHistoriskPeriode(state)
});

export default component => connect(mapStateToProps)(AktivitetsmalModalHOC(component));
