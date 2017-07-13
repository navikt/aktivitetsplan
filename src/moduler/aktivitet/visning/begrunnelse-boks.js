import React, { Component } from 'react';
import PT from 'prop-types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import classNames from 'classnames';
import visibleIfHOC from '../../../hocs/visible-if';
import { autobind } from '../../../utils';

class BegrunnelseBoks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kollapset: true,
        };
        autobind(this);
    }
    settKollapset(e) {
        e.preventDefault();
        this.setState({
            kollapset: !this.state.kollapset,
        });
    }
    render() {
        const classes = classNames({
            'tekst--kollapset': this.state.kollapset,
            tekst: !this.state.kollapset,
        });
        /* eslint-disable */
        return (
            <div className="begrunnelse-boks" onClick={this.settKollapset}>
                <AlertStripeInfo>
                    <span className={classes}>
                        {this.props.begrunnelse}
                    </span>
                </AlertStripeInfo>
            </div>
        );
        /* eslint-enable */
    }
}

BegrunnelseBoks.propTypes = {
    begrunnelse: PT.string.isRequired,
};

export default visibleIfHOC(BegrunnelseBoks);
