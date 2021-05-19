import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Aktivitet, AktivitetStatus, StillingsStatus, TransaksjonsType } from '../../../../datatypes/aktivitetTypes';
import BrukeravhengigTekst from '../../../../felles-komponenter/BrukeravhengigTekst';
import { formaterDatoEllerTidSiden, formaterDatoKortManed } from '../../../../utils';
import { useSelector } from 'react-redux';
import { selectErBruker } from '../../../identitet/identitet-selector';

interface Props {
    versjon: Aktivitet,
    prevVersjon?: Aktivitet
}

// TODO fjerne tekster 'endringstype.*'
const VersjonInnslag = (props: Props) => {
    const {versjon, prevVersjon} = props;
    const erBruker = useSelector(selectErBruker);

    const endringsTekst = () => {
        switch (versjon.transaksjonsType) {
            case TransaksjonsType.MOTE_TID_OG_STED_ENDRET:
                return 'endret tid eller sted for møtet';
            case TransaksjonsType.REFERAT_OPPRETTET:
                return 'opprettet referat';
            case TransaksjonsType.REFERAT_ENDRET:
                return 'endret referatet';
            case TransaksjonsType.REFERAT_PUBLISERT:
                return 'delte referatet';
            case TransaksjonsType.BLE_HISTORISK:
                return 'arkiverte aktiviteten';
            case TransaksjonsType.DETALJER_ENDRET:
                return 'endret detaljer på aktiviteten';
            case TransaksjonsType.AVTALT:
                return 'merket aktiviteten som "Avtalt med NAV"';
            case TransaksjonsType.OPPRETTET:
                return 'opprettet aktiviteten';
            case TransaksjonsType.FORHAANDSORIENTERING_LEST: {
                const sittEllerDitt = erBruker ? 'ditt' : 'sitt';
                return `bekreftet å ha lest informasjon om ansvaret ${sittEllerDitt}`;
            }
            case TransaksjonsType.AVTALT_DATO_ENDRET: {
                const fraDatoString = formaterDatoKortManed(prevVersjon ? prevVersjon.tilDato : undefined);
                const tilDatoString = formaterDatoKortManed(versjon.tilDato);
                return `endret til dato på aktiviteten fra ${fraDatoString} til ${tilDatoString}`;
            }
            case TransaksjonsType.STATUS_ENDRET: {
                const fraStatus = prevVersjon ? aktivitetStatusTilBeskrivelse(prevVersjon?.status) : 'ingen';
                const tilStatus = aktivitetStatusTilBeskrivelse(versjon?.status);
                return `flyttet aktiviteten fra ${fraStatus} til ${tilStatus}`;
            }

            case TransaksjonsType.ETIKETT_ENDRET: {
                const tilStatus = versjon.etikett ? stillingStatusTilBeskrivelse(versjon.etikett) : 'Ingen';
                return `endret tilstand til ${tilStatus}`;
            }
            default: // Vi skal aldri komme hit
                return 'gjorde noe';
        }
    }

    return (
        <div className="versjon-for-aktivitet-innslag">
            <Element className="versjon-for-aktivitet-innslag__identitet">
                <BrukeravhengigTekst lagtInnAv={versjon.lagtInnAv} endretAv={versjon.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst()}
            <Normaltekst>{formaterDatoEllerTidSiden(versjon.endretDato)}</Normaltekst>
        </div>
    );
}

export default VersjonInnslag;

function aktivitetStatusTilBeskrivelse(aktivitetStatus: AktivitetStatus ) {
    switch (aktivitetStatus) {
        case 'AVBRUTT':
            return 'avbrutt';
        case 'FULLFORT':
            return 'fullført';
        case 'GJENNOMFORES':
            return 'gjennomfører';
        case 'PLANLAGT':
            return 'planlegger';
        case 'BRUKER_ER_INTERESSERT':
            return 'forslag';
    }
}

function stillingStatusTilBeskrivelse(stillingStatus: StillingsStatus) {
    switch (stillingStatus) {
        case 'INGEN_VALGT':
            return 'Ingen';
        case 'SOKNAD_SENDT':
            return 'Søknaden er sendt';
        case 'INNKALT_TIL_INTERVJU':
            return 'Skal på intervju';
        case 'AVSLAG':
            return 'Fått avslag';
        case 'JOBBTILBUD':
            return 'Fått jobbtilbud';

    }
}
