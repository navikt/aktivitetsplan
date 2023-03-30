import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, isSamtaleOrMote } from '../../../../datatypes/internAktivitetTypes';
import { manglerPubliseringAvSamtaleReferat } from '../../aktivitet-util';

export const kanOppdatereStatus = (aktivitet: VeilarbAktivitet, status: AktivitetStatus) => {
    const ferdigStatus = [AktivitetStatus.FULLFOERT, AktivitetStatus.AVBRUTT].includes(status);
    const ferdigOgManglerPubliseringAvSamtaleReferat =
        isSamtaleOrMote(aktivitet) && ferdigStatus && manglerPubliseringAvSamtaleReferat(aktivitet, status);

    if (ferdigOgManglerPubliseringAvSamtaleReferat) {
        return 'Samtalereferatet må deles før du kan sette aktiviteten til denne statusen';
    }

    return undefined;
};
