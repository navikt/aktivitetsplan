import React from 'react';

import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
import aktivitetsvisningStyles from '../../Aktivitetsvisning.module.less';
import DeleLinje from '../../delelinje/delelinje';
import { useKanSendeVarsel } from '../avtaltHooks';
import ArenaForhaandsorienteringForm from './ArenaForhaandsorienteringForm';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: ArenaAktivitet;
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
            <div className={aktivitetsvisningStyles.underseksjon}>
                {merEnnSyvDagerTil ? (
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst />
                ) : (
                    <ArenaForhaandsorienteringForm
                        setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
                        aktivitet={aktivitet}
                        setForhandsorienteringType={setForhandsorienteringType}
                        hidden={!merEnnSyvDagerTil}
                    />
                )}
            </div>
        </>
    );
};

export default ArenaForhaandsorienteringFormKomponent;
