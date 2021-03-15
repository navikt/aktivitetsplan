import { Values } from '@nutgaard/use-formstate';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../api/utils';
import {
    GRUPPE_AKTIVITET_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import { Aktivitet, Forhaandsorientering, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import { settAktivitetTilAvtalt } from '../../aktivitet-actions';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import AvtaltContainerGammel from '../avtalt-container-gammel/AvtaltContainer-gammel';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';
import AvtaltForm, { Handler } from './AvtaltForm';
import { useSendAvtaltMetrikker } from './avtaltHooks';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';
import { ForhaandsorienteringDialogProps, getForhaandsorienteringText } from './utilsForhaandsorientering';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

const AvtaltContainer = (props: Props) => {
    const { underOppfolging, aktivitet, className } = props;
    const { type, status, historisk, avtalt } = aktivitet;

    const [sendtAtErAvtaltMedNav, setSendtAtErAvtaltMedNav] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState<ForhaandsorienteringType>(
        ForhaandsorienteringType.IKKE_SEND
    );

    const dispatch = useDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();

    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const erBruker = useSelector(selectErBruker);

    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    if (
        erBruker ||
        historisk ||
        !underOppfolging ||
        status === STATUS_FULLFOERT ||
        status === STATUS_AVBRUTT ||
        erArenaAktivitet
    ) {
        return null;
    }

    if (
        !sendtAtErAvtaltMedNav &&
        aktivitet.forhaandsorientering &&
        aktivitet.forhaandsorientering.type === ForhaandsorienteringType.IKKE_SEND
    ) {
        return null;
    }

    // Kun vis bekreftet hvis nettopp satt til avtalt.
    if (!sendtAtErAvtaltMedNav && avtalt) {
        return (
            <>
                <DeleLinje />
                <Forhaandsorenteringsvisning forhaandsorientering={aktivitet.forhaandsorientering} />
                <DeleLinje />
            </>
        );
    }

    if (avtalt) {
        return (
            <>
                <DeleLinje />
                <SattTilAvtaltInfotekst
                    mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                    forhaandsorienteringstype={forhandsorienteringType}
                    className={className}
                />
                <Forhaandsorenteringsvisning forhaandsorientering={aktivitet.forhaandsorientering} />
                <DeleLinje />
            </>
        );
    }

    const doSettAktivitetTilAvtaltNy = (aktivitet: Aktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt(aktivitet, forhaandsorientering));

    const onSubmit: Handler = (avtaltFormMapped: Values<ForhaandsorienteringDialogProps>) => {
        const avtaltForm: ForhaandsorienteringDialogProps = avtaltFormMapped as ForhaandsorienteringDialogProps;
        setSendtAtErAvtaltMedNav(true);
        const tekst = getForhaandsorienteringText(avtaltForm);
        doSettAktivitetTilAvtaltNy(aktivitet, { type: avtaltForm.forhaandsorienteringType, tekst });
        setForhandsorienteringType(avtaltForm.forhaandsorienteringType);

        sendMetrikker(avtaltForm.forhaandsorienteringType, aktivitet.type, mindreEnnSyvDagerTil);

        // @ts-ignore
        document.querySelector('.aktivitet-modal').focus();
        return Promise.resolve();
    };

    return (
        <>
            <DeleLinje />
            <AvtaltForm
                className={`${className} avtalt-container`}
                oppdaterer={aktivitetStatus === STATUS.RELOADING}
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                lasterData={aktivitetStatus !== STATUS.OK}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </>
    );
};

const AvtaltContainerWrapper = (props: Props) => {
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();
    return brukeNyForhaandsorientering ? <AvtaltContainer {...props} /> : <AvtaltContainerGammel {...props} />;
};

export default AvtaltContainerWrapper;
