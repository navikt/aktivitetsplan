import React from 'react';
import { DemoIkon } from './demoIkon';
import Modal from 'nav-frontend-modal';
import DemoDashboard from './demoDashboard';

class DemoBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen,
        };
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    render() {
        return (
            <div>
                <DemoIkon onClick={this.openModal} />
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} closeButton={true}>
                    <DemoDashboard />
                </Modal>
            </div>
        );
    }
}

export default DemoBanner;
