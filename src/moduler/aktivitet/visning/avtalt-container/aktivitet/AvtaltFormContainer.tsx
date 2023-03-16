import React from 'react';
import { useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
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
            {aktivitet.avtalt && aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                mindreEnnSyvDagerTil ? (
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst />
                ) : (
                    <ForhaandsorienteringForm hidden={mindreEnnSyvDagerTil} {...props} />
                )
            ) : (
                <AvtaltForm
                    oppdaterer={bekreftStatus === STATUS.RELOADING}
                    lasterData={nettverksStatus !== STATUS.OK}
                    mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                    {...props}
                />
            )}
        </>
    );
};

export default AvtaltFormContainer;
