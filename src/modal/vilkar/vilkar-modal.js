import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../modal';
import history from '../../history';
import ModalHeader from '../modal-header';
import Vilkar from './vilkar';
import * as AppPT from '../../proptypes';
import { hentHistoriskeVilkar } from '../../ducks/historiske-vilkar';
import { autobind } from '../../utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

class VilkarModal extends Component {

    constructor(props) {
        super(props);
        autobind(this);
    }

    componentWillMount() {
        this.props.doHentHistoriskeVilkar();
    }

    render() {
        return (
            <Modal
                isOpen
                onRequestClose={() => history.push('/')}
                contentLabel="vilkar-modal"
            >
                <ModalHeader>
                    <Innholdslaster avhengigheter={[this.props.historiskeVilkar]}>
                        <Vilkar visVilkar historiskeVilkarListe={this.props.historiskeVilkar.data} />
                    </Innholdslaster>
                </ModalHeader>
            </Modal>
        );
    }
}

VilkarModal.propTypes = {
    historiskeVilkar: AppPT.vilkar.isRequired,
    doHentHistoriskeVilkar: PT.func.isRequired
};


const mapStateToProps = (state) => ({
    historiskeVilkar: state.data.historiskeVilkar
});

const mapDispatchToProps = (dispatch) => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar())
});

export default connect(mapStateToProps, mapDispatchToProps)(VilkarModal);
