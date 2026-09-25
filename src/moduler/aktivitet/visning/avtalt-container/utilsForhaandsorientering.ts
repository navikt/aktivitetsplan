import { AktivitetStatus, AlleAktiviteter, isVeilarbAktivitet } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { ForhaandsorienteringDialogFormValues } from './aktivitet/AvtaltForm';

export const getForhaandsorienteringText = (
    forhaandsorienteringDialogFormValues: ForhaandsorienteringDialogFormValues,
) => {
    switch (forhaandsorienteringDialogFormValues.forhaandsorienteringType) {
        case ForhaandsorienteringType.SEND_STANDARD:
            return forhaandsorienteringDialogFormValues.avtaltText;
        case ForhaandsorienteringType.SEND_PARAGRAF_11_9:
            return forhaandsorienteringDialogFormValues.avtaltText119;
        case ForhaandsorienteringType.IKKE_SEND:
            return '';
        default:
            throw new Error('Ukjent avtalttype');
    }
};

export const AVTALT_TEKST =
    `Det er viktig at du gjennomfører denne aktiviteten med Nav. Gjør du ikke det, kan det medføre at ` +
    'stønaden du mottar fra Nav bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';

export const AVTALT_TEKST_119 = `Ta kontakt med oss så raskt som mulig hvis du ikke kan gjennomføre denne aktiviteten.
Det er viktig fordi hvis du uten rimelig grunn lar være å komme på møter eller ikke gjennomfører fastsatte aktiviteter, så kan vi redusere utbetalingen din med en stønadsdag. Det går frem av folketrygdloven § 11-9 og forskrift om arbeidsavklaringspenger § 4`;

export const skalMarkereForhaandsorienteringSomLest = (erBruker: boolean, aktivitet?: AlleAktiviteter) => {
    if (aktivitet === undefined) return false;

    const fho = aktivitet?.forhaandsorientering;
    const ikkeHistorisk = isVeilarbAktivitet(aktivitet) ? !aktivitet.historisk : true;
    return (
        !!fho?.type &&
        !fho.lestDato &&
        fho.type !== ForhaandsorienteringType.IKKE_SEND &&
        erBruker &&
        ikkeHistorisk &&
        aktivitet?.status !== AktivitetStatus.FULLFOERT &&
        aktivitet?.status !== AktivitetStatus.AVBRUTT
    );
};
