import React, { Component } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import Accordion from '../../felles-komponenter/accordion';
import { formaterDatoKortManed, autobind } from '../../utils';

class VilkarHistorikk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        autobind(this);
    }
    onClick() {
        this.setState({
            apen: !this.state.apen,
        });
    }
    render() {
        function historiskVilkarLink(status, dato, guid) {
            const formattertDato = formaterDatoKortManed(dato);
            return (
                <Link
                    to={`vilkar/${guid}`}
                    key={`${guid}`}
                    className="vilkar__link lenke lenke--frittstaende"
                >
                    <FormattedMessage
                        id="vilkar.modal.gjeldende-status-dato-link"
                        values={{ status, dato: formattertDato }}
                    />
                </Link>
            );
        }
        const accordionLabelId = this.state.apen
            ? 'vilkar.modal.skjul-siste-historiske-vilkar'
            : 'vilkar.modal.vis-siste-historiske-vilkar';
        return (
            <div className="vilkar__historikk">
                <Accordion labelId={accordionLabelId} onClick={this.onClick}>
                    {this.props.resterendeVilkar
                        .filter(
                            vilkar => vilkar.vilkarstatus !== 'IKKE_BESVART'
                        )
                        .map(vilkar =>
                            historiskVilkarLink(
                                vilkar.vilkarstatus,
                                vilkar.dato,
                                vilkar.guid
                            )
                        )}
                </Accordion>
            </div>
        );
    }
}

VilkarHistorikk.propTypes = {
    resterendeVilkar: PT.arrayOf(AppPT.vilkar).isRequired,
};

export default VilkarHistorikk;
