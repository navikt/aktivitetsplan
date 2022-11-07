import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import { hentDialog } from '../moduler/dialog/dialog-reducer';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarselReducer';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import Routing, { PublicRouting } from '../routing';
import { hentFnrFraUrl } from '../utils/fnr-util';
import Aktivitetstavle from './tavle/Aktivitetstavle';

const Hovedside = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentDialog() as unknown as AnyAction);
        dispatch(hentEskaleringsvarsel() as unknown as AnyAction);
    }, [dispatch]);

    const fnr = hentFnrFraUrl();
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
                    <Aktivitetstavle />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
};

export default Hovedside;
