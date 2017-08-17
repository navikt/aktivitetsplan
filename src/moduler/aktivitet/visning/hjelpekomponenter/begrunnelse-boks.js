import React, { Component } from 'react';
import PT from 'prop-types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';
import visibleIfHOC from '../../../../hocs/visible-if';
import { autobind } from '../../../../utils';

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
        const { begrunnelse } = this.props;
        const classes = classNames({
            'tekst--kollapset': this.state.kollapset,
            tekst: !this.state.kollapset,
        });
        /* eslint-disable */
        return (
            <div className="begrunnelse-boks" onClick={this.settKollapset}>
                <AlertStripeInfo>
                    <Normaltekst className={classes}>
                        {begrunnelse}
                    </Normaltekst>
                </AlertStripeInfo>
            </div>
        );
        /* eslint-enable */
    }
}

BegrunnelseBoks.defaultProps = {
    className: '',
};

BegrunnelseBoks.propTypes = {
    begrunnelse: PT.string.isRequired,
    className: PT.string,
};

export default visibleIfHOC(BegrunnelseBoks);
