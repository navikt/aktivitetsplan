import React, {PropTypes as PT} from 'react';
import ReactModal from 'react-modal';


// ReactModal.setAppElement('#modal-a11y-wrapper');

class Applikasjon extends React.Component {

    // TODO også i aktivitetsplan???
    // TODO også i aktivitetsplan???
    // TODO også i aktivitetsplan???
    // TODO også i aktivitetsplan???

    constructor() {
        super();
        ReactModal.setAppElement('#modal-a11y-wrapper');
    }

    render() {
        const {children} = this.props;
        return (
            <div className="aktivitetsplan">
                {children}
            </div>
        );
    }
}

Applikasjon.propTypes = {
    children: PT.node
};

export default Applikasjon;
