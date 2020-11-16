import React, { Component } from 'react';
import Varslinger from '../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/Aktivitetstavle';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import Navigasjonslinje from '../moduler/verktoylinje/navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Maal from '../moduler/mal-linje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';
import { hentDialog } from '../moduler/dialog/dialog-reducer';
import { connect } from 'react-redux';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';

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
