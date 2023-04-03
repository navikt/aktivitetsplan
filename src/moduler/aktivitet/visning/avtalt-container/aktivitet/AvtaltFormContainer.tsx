import React from 'react';
import { useSelector } from 'react-redux';

import { Status } from '../../../../../createGenericSlice';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils/dateUtils';
import { selectAktivitetFhoBekreftStatus, selectAktivitetStatus } from '../../../aktivitet-selector';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from '../arena-aktivitet/KanIkkeLeggeTilForhaandsorienteringInfotekst';
import AvtaltForm from './AvtaltForm';
import ForhaandsorienteringForm from './ForhaandsorienteringForm';

interface Props {
    aktivitet: VeilarbAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const AvtaltFormContainer = (props: Props) => {
    const { aktivitet } = props;

    const bekreftStatus = useSelector(selectAktivitetFhoBekreftStatus);
    const nettverksStatus = useSelector(selectAktivitetStatus);

    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    return (
        <>
            {aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE && aktivitet.avtalt ? (
                mindreEnnSyvDagerTil ? (
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst />
                ) : (
                    <ForhaandsorienteringForm {...props} aktivitet={aktivitet} />
                )
            ) : (
                <AvtaltForm
                    oppdaterer={bekreftStatus === Status.RELOADING}
                    lasterData={nettverksStatus !== Status.OK}
                    mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                    {...props}
                />
            )}
        </>
    );
};

export default AvtaltFormContainer;
