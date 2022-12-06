import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from 'redux';

import AktivitetsplanRouting from '../AktivitetsplanRoutes';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
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
import { aktivitetRoute } from '../routes';
import DobbleLonnstilskuddAdvarsel from './DobbleLonnstilskuddAdvarsel';
import Aktivitetstavle from './tavle/Aktivitetstavle';

const Hovedside = () => {
    const navigate = useNavigate();
    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId), { replace: true });
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentDialog() as unknown as AnyAction);
        dispatch(hentEskaleringsvarsel() as unknown as AnyAction);
    }, [dispatch]);

    return (
        <div className="hovedside">
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <Nivaa4Feilmelding />
                <OppfolgingStatus>
                    <InformasjonsHenting />
                    <Varslinger />
                    <div className="container">
                        <Navigasjonslinje />
                        <DobbleLonnstilskuddAdvarsel />
                        <Maal />
                        <Verktoylinje />
                    </div>
                    <Aktivitetstavle />
                    <AktivitetsplanRouting />
                </OppfolgingStatus>
            </div>
        </div>
    );
};

export default Hovedside;
