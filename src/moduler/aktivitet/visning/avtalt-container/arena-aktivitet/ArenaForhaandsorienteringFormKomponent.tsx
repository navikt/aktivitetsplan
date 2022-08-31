import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
import aktivitetsvisningStyles from '../../Aktivitetsvisning.module.css';
import DeleLinje from '../../delelinje/delelinje';
import { useKanSendeVarsel } from '../avtaltHooks';
import ForhaandsorienteringForm from './ForhaandsorienteringForm';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: Aktivitet;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const ArenaForhaandsorienteringFormKomponent = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, aktivitet, setForhandsorienteringType } = props;

    const merEnnSyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;
    const kanSendeVarsel = useKanSendeVarsel();

    if (!kanSendeVarsel) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <div className={aktivitetsvisningStyles.underseksjon}>
                <KanIkkeLeggeTilForhaandsorienteringInfotekst merEnnSyvDagerTil={merEnnSyvDagerTil} />
                <ForhaandsorienteringForm
                    setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
                    aktivitet={aktivitet}
                    setForhandsorienteringType={setForhandsorienteringType}
                    hidden={!merEnnSyvDagerTil}
                />
            </div>
            <DeleLinje />
        </>
    );
};

export default ArenaForhaandsorienteringFormKomponent;
