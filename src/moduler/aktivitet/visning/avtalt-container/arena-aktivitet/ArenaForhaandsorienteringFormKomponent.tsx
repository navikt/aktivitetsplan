import React from 'react';

import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils/dateUtils';
import ForhaandsorienteringForm from '../aktivitet/ForhaandsorienteringForm';
import { useKanSendeVarsel } from '../avtaltHooks';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

interface Props {
    aktivitet: ArenaAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const ArenaForhaandsorienteringFormKomponent = (props: Props) => {
    const { aktivitet, setSendtAtErAvtaltMedNav, setForhandsorienteringType } = props;

    const merEnnSyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;
    const kanSendeVarsel = useKanSendeVarsel();

    if (!kanSendeVarsel) {
        return null;
    }

    return (
        <>
            <div className="my-4">
                {!merEnnSyvDagerTil ? (
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst />
                ) : (
                    <ForhaandsorienteringForm
                        aktivitet={aktivitet}
                        setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
                        setForhandsorienteringType={setForhandsorienteringType}
                    />
                )}
            </div>
        </>
    );
};

export default ArenaForhaandsorienteringFormKomponent;
