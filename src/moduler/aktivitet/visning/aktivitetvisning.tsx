import React from 'react';
import PT from 'prop-types';
import UnderelementerForAktivitet from './underelement-for-aktivitet/underelementer-for-aktivitet';
import * as AppPT from '../../../proptypes';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import AvtaltContainer from './avtalt-container/avtalt-container';
import { GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE } from '../../../constant';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/varsling-boks';
import AktivitetinformasjonVisning from './hjelpekomponenter/aktivitetinformasjon-visning';
import Statusadministrasjon from './hjelpekomponenter/statusadministrasjon';
import ReferatContainer from './referat/referat-container';
import lazyHOC from '../../../felles-komponenter/lazy/lazyHOC';
import { trengerBegrunnelse } from '../aktivitet-util';
import DialogLink from './underelement-for-aktivitet/DialogLink';
import { useSelector } from 'react-redux';
import { selectFeatureData } from '../../../felles-komponenter/feature/feature-selector';
import { harFeature, VIS_NY_DIALOG } from '../../../felles-komponenter/feature/feature';
import EndringsLogg from './underelement-for-aktivitet/EndringsLogg';
import { Aktivitet } from '../../../types';

interface Props {
    aktivitet: Aktivitet;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

function Aktivitetvisning(props: Props) {
    const { aktivitet, tillatEndring, laster, underOppfolging } = props;

    const features = useSelector(selectFeatureData);
    const nyDialog = harFeature(VIS_NY_DIALOG, features);
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

                <UnderelementerForAktivitet
                    aktivitet={aktivitet}
                    hidden={nyDialog}
                    className="aktivitetvisning__underseksjon"
                />
                <DialogLink aktivitet={aktivitet} hidden={!nyDialog} skulDelelingje={arenaAktivitet} />
                <EndringsLogg aktivitet={aktivitet} hidden={!nyDialog || arenaAktivitet} />
            </ModalContainer>
        </div>
    );
}

Aktivitetvisning.defaultProps = {
    aktivitet: {}
};

Aktivitetvisning.propTypes = {
    aktivitet: AppPT.aktivitet,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired
};

export default lazyHOC(Aktivitetvisning);
