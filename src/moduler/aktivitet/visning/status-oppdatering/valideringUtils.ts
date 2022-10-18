import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, isSamtaleOrMøte } from '../../../../datatypes/internAktivitetTypes';
import { manglerPubliseringAvSamtaleReferat, trengerBegrunnelse } from '../../aktivitet-util';
import { ValideringsProps } from './AktivitetStatusForm';

export const kanOppdatereStatus = (aktivitet: VeilarbAktivitet, values: ValideringsProps) => {
    const status = values.aktivitetstatus as AktivitetStatus;
    const ferdigStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const ferdigOgManglerPubliseringAvSamtaleReferat =
        isSamtaleOrMøte(aktivitet) && ferdigStatus && manglerPubliseringAvSamtaleReferat(aktivitet, status);

    if (ferdigOgManglerPubliseringAvSamtaleReferat) {
        return 'Samtalereferatet må deles før du kan sette aktiviteten til denne statusen';
    }

    return undefined;
};

export const validateBegrunnelse = (value: string, values: ValideringsProps, aktivitet: VeilarbAktivitet) => {
    const status = values.aktivitetstatus as AktivitetStatus;
    if (trengerBegrunnelse(aktivitet.avtalt, status, aktivitet.type) && value.trim().length === 0) {
        return 'Du må fylle ut en begrunnelse';
    }
    if (value.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }
    return undefined;
};
