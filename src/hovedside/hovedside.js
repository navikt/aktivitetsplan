import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hentDialog } from '../moduler/dialog/dialog-reducer';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Varslinger from '../moduler/varslinger/varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../utils/fnr-util';
import AktivitetsTavle from './tavle/Aktivitetstavle';

class Hovedside extends Component {
    componentDidMount() {
        const { doHentDialog } = this.props;
        doHentDialog();
    }

    render() {
        const fnr = getFodselsnummer();
        return (
            <div className="hovedside" key={fnr}>
                <div className="hovedsideinnhold">
                    <HovedsideFeilmelding />
                    <Nivaa4Feilmelding />
                    <OppfolgingStatus>
                        <InformasjonsHenting />
                        <Varslinger />
                        <div className="container">
                            <Navigasjonslinje />
                            <Maal />
                            <Verktoylinje />
                        </div>
                        <AktivitetsTavle />
                        <Routing />
                    </OppfolgingStatus>
                    <PublicRouting />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    doHentDialog: () => dispatch(hentDialog()),
});

export default connect(undefined, mapDispatchToProps)(Hovedside);
