import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import LenkeTilDialog from '../../../dialog/DialogLink';
import DeleLinje from '../delelinje/delelinje';
import { IKKE_SEND_FORHAANDSORIENTERING, SEND_FORHAANDSORIENTERING, SEND_PARAGRAF_11_9 } from './AvtaltForm';

interface Props {
    erManuellKrrKvpBruker: boolean;
    forhaandsorienteringstype: string;
    mindrennSyvDager: boolean;
    dialogId?: string;
    className?: string;
    skalBrukeNyForaandsorientering: boolean;
}

export const SendtSuksesInfoLinje = (props: Props) => {
    const {
        erManuellKrrKvpBruker,
        forhaandsorienteringstype,
        mindrennSyvDager,
        dialogId,
        className,
        skalBrukeNyForaandsorientering,
    } = props;
    const tekst = getTekst(erManuellKrrKvpBruker, forhaandsorienteringstype, mindrennSyvDager);

    if (!skalBrukeNyForaandsorientering) {
        return <Gammel tekst={tekst} dialogId={dialogId} className={className} />;
    }

    return (
        <div>
            <div className={className}>
                <AlertStripeSuksess>
                    <Normaltekst>{tekst}</Normaltekst>
                </AlertStripeSuksess>
            </div>
            <DeleLinje />
        </div>
    );
};

const getTekst = (
    erManuellKrrKvpBruker: boolean,
    forhaandsorienteringstype: string,
    mindrennSyvDager: boolean
): string => {
    if (erManuellKrrKvpBruker) {
        return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering er ikke sendt.';
    }

    if (mindrennSyvDager) {
        return 'Aktiviteten er merket "Avtalt med NAV". Forhåndsorientering er ikke sendt, men brukeren skal være informert om mulige konsekvenser for ytelse og du skal ha dokumentert dette.';
    }

    switch (forhaandsorienteringstype) {
        case SEND_FORHAANDSORIENTERING:
            return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering (standard melding) er sendt.';
        case SEND_PARAGRAF_11_9:
            return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering for §11-9 (AAP) er sendt.';
        case IKKE_SEND_FORHAANDSORIENTERING:
            return 'Aktiviteten er merket "Avtalt med NAV" og forhåndsorientering er ikke sendt.';
    }

    return 'Noe feil har skjedd ta kontakt med brukerstøtte';
};

interface GammelProps {
    tekst: string;
    className?: string;
    dialogId?: string;
}

const Gammel = (props: GammelProps) => (
    <div>
        <div className={props.className}>
            <AlertStripeSuksess>
                <Normaltekst>{props.tekst}</Normaltekst>
                <LenkeTilDialog dialogId={props.dialogId} className="">
                    Se meldingen
                </LenkeTilDialog>
            </AlertStripeSuksess>
        </div>
        <DeleLinje />
    </div>
);
