import React from 'react';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import AvtaltContainer from './avtalt-container/avtalt-container';
import { GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE } from '../../../constant';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/varsling-boks';
import AktivitetinformasjonVisning from './hjelpekomponenter/aktivitetinformasjon-visning';
import Statusadministrasjon from './hjelpekomponenter/statusadministrasjon';
import ReferatContainer from './referat/referat-container';
import { trengerBegrunnelse } from '../aktivitet-util';
import EndringsLogg from './underelement-for-aktivitet/EndringsLogg';
import { Aktivitet } from '../../../types';
import DialogLenke from './underelement-for-aktivitet/dialog/DialogLenke';

interface Props {
    aktivitet: Aktivitet;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

function Aktivitetvisning(props: Props) {
    const { aktivitet, tillatEndring, laster, underOppfolging } = props;

    const arenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(
        aktivitet.type
    );

    const visBegrunnelse = !arenaAktivitet && trengerBegrunnelse(!!aktivitet.avtalt, aktivitet.status, aktivitet.type);

    return (
        <div>
            <ModalContainer className="aktivitetvisning">
                <VarslingBoks className="aktivitetvisning__underseksjon" aktivitet={aktivitet} />

                <BegrunnelseBoks
                    className="aktivitetvisning__underseksjon"
                    begrunnelse={aktivitet.avsluttetKommentar}
                    visible={visBegrunnelse}
                />

                <AktivitetinformasjonVisning
                    valgtAktivitet={aktivitet}
                    tillatEndring={tillatEndring}
                    underOppfolging={underOppfolging}
                    laster={laster}
                />

                <AvtaltContainer
                    underOppfolging={underOppfolging}
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                />

                <ReferatContainer aktivitet={aktivitet} />

                <Statusadministrasjon aktivitet={aktivitet} arenaAktivitet={arenaAktivitet} />

                <DialogLenke aktivitet={aktivitet} skulDelelingje={arenaAktivitet} />
                <EndringsLogg aktivitet={aktivitet} hidden={arenaAktivitet} />
            </ModalContainer>
        </div>
    );
}

export default Aktivitetvisning;
