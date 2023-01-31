import AlertStripe from 'nav-frontend-alertstriper';
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
import Navigasjonslinje from '../moduler/verktoylinje/navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { aktivitetRoute } from '../routes';
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
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <Nivaa4Feilmelding />
                <OppfolgingStatus>
                    <InformasjonsHenting />
                    <Varslinger />
                    <div className="container">
                        <Navigasjonslinje />
                        <AlertStripe
                            className="lonnstilskudd-advarsel"
                            type={'advarsel'}
                            title={'Vi opplever en teknisk feil i aktivitetsplanen'}
                        >
                            <h1 className="lonnstilskudd-advarsel__tittel">
                                Lønnstilskudd kan dukke opp flere ganger i aktivitetsplanen din
                            </h1>
                            <p>
                                Vi erstatter nå det gamle systemet for varig og midlertidig lønnstilskudd med et nytt
                                system. Fordi vi bytter system kan samme lønnstilskudd dukke opp to ganger i
                                aktivitetsplanen din.
                            </p>
                            <p>Du fortsetter å få pengene dine som før, og du trenger ikke å gjøre noe.</p>
                        </AlertStripe>
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
