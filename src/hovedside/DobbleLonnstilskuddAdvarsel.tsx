import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
/*
import { useSelector } from 'react-redux';
import { VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';
import { selectAktiviterForAktuellePerioden } from '../moduler/aktivitet/aktivitetlisteSelector';
*/

const DobbleLonnstilskuddAdvarsel = () => {
    /*
    TODO: Bare vis denne banneren hvis brukeren har lønnstilskudd
    const alleAktiviteter = useSelector(selectAktiviterForAktuellePerioden).filter(
        (aktiviteter) => aktiviteter.type === Are
    );*/

    return (
        <AlertStripe
            className="lonnstilskudd-advarsel"
            type={'advarsel'}
            title={'Vi opplever en teknisk feil i aktivitetsplanen'}
        >
            <h1 className="lonnstilskudd-advarsel__tittel">
                Lønnstilskudd kan dukke opp flere ganger i aktivitetsplanen din
            </h1>
            <p>
                Vi erstatter nå det gamle systemet for varig og midlertidig lønnstilskudd med et nytt system. Fordi vi
                bytter system kan samme lønnstilskudd dukke opp to ganger i aktivitetsplanen din.
            </p>
            <p>Du fortsetter å få pengene dine som før, og du trenger ikke å gjøre noe.</p>
        </AlertStripe>
    );
};

export default DobbleLonnstilskuddAdvarsel;
