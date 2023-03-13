import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AnyAction } from 'redux';

import AktivitetsplanRouting, { PublicRouting } from '../aktivitetsplanRouting';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentDialog } from '../moduler/dialog/dialog-reducer';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarselReducer';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { aktivitetRoute } from '../routes';
import DobbleLonnstilskuddAdvarsel from './DobbleLonnstilskuddAdvarsel';
import Aktivitetstavle from './tavle/Aktivitetstavle';

const Hovedside = () => {
    const history = useHistory();
    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        history.replace(aktivitetRoute(aktivitetId));
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentDialog() as unknown as AnyAction);
        dispatch(hentEskaleringsvarsel() as unknown as AnyAction);
    }, [dispatch]);

    return (
        <div className="hovedside">
            <div className="flex items-center flex-col h-full">
                <HovedsideFeilmelding />
                <Nivaa4Feilmelding />
                <OppfolgingStatus>
                    <InformasjonsHenting />
                    <Varslinger />
                    <div className="container flex flex-col gap-y-4">
                        <Navigasjonslinje />
                        <DobbleLonnstilskuddAdvarsel />
                        <Maal />
                        <Verktoylinje />
                    </div>
                    <Aktivitetstavle />
                    <AktivitetsplanRouting />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
};

export default Hovedside;
