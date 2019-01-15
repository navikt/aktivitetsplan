import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../moduler/varslinger/varslinger';
import Verktoylinje from '../moduler/verktoylinje/verktoylinje';
import VerktoylinjeOriginal from '../moduler/verktoylinje/verktoylinje-original';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import NavigasjonslinjeOriginal from './navigasjonslinje/navigasjonslinje-original';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import PrivateFeilmelding from '../moduler/feilmelding/private-feilmelding';
import VisaValgtFilter from '../moduler/filtrering/filter-vis-label';
import MitMaal from './maalLinje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';
import {
    harFeature,
    VERKTOYLINJE,
} from '../felles-komponenter/feature/feature';
import { selectFeatureData } from '../felles-komponenter/feature/feature-selector';

function Hovedside({ harNyVerktoylinje }) {
    const fnr = getFodselsnummer();

    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <ArenaFeilmelding />
                <OppfolgingStatus>
                    {harNyVerktoylinje && <Navigasjonslinje />}
                    <PrivateFeilmelding />
                    <Varslinger />
                    <Container>
                        <MitMaal />
                        {harNyVerktoylinje
                            ? <Verktoylinje />
                            : <div>
                                  <VerktoylinjeOriginal />
                                  <NavigasjonslinjeOriginal />
                              </div>}
                        <VisaValgtFilter />
                    </Container>
                    <AktivitetsTavle />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

Hovedside.propTypes = {
    harNyVerktoylinje: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const harNyVerktoylinje = harFeature(
        VERKTOYLINJE,
        selectFeatureData(state)
    );
    return {
        harNyVerktoylinje,
    };
};

export default connect(mapStateToProps)(Hovedside);
