import { Modal } from '@navikt/ds-react';
import React from 'react';

import DemoDashboard from './demoDashboard';
import { DemoIkon } from './demoIkon';

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
                <Modal open={this.state.modalIsOpen} onClose={this.closeModal}>
                    <DemoDashboard />
                </Modal>
            </div>
        );
    }
}

export default DemoBanner;
