import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';

export interface ForhaandsorienteringDialogProps {
    avtaltText: string;
    avtaltText119: string;
    forhaandsorienteringType: ForhaandsorienteringType;
}

export const getForhaandsorienteringText = (avtaltTextProps: ForhaandsorienteringDialogProps) => {
    switch (avtaltTextProps.forhaandsorienteringType) {
        case ForhaandsorienteringType.SEND_STANDARD:
            return avtaltTextProps.avtaltText;
        case ForhaandsorienteringType.SEND_PARAGRAF_11_9:
            return avtaltTextProps.avtaltText119;
        case ForhaandsorienteringType.IKKE_SEND:
            return '';
        default:
            throw new Error('Ukjent avtalttype');
    }
};

export const skalMarkereForhaandsorienteringSomLest = (erBruker: boolean, aktivitet?: Aktivitet) => {
    const fho = aktivitet?.forhaandsorientering;
    return (
        !!fho?.type &&
        !fho.lestDato &&
        fho.type !== ForhaandsorienteringType.IKKE_SEND &&
        erBruker &&
        !aktivitet?.historisk &&
        aktivitet?.status !== STATUS_FULLFOERT &&
        aktivitet?.status !== STATUS_AVBRUTT
    );
};
