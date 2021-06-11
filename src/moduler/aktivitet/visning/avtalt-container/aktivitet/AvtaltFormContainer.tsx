import { Values } from '@nutgaard/use-formstate';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { Aktivitet, Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectAktivitetFhoBekreftStatus, selectAktivitetStatus } from '../../../aktivitet-selector';
import DeleLinje from '../../delelinje/delelinje';
import { useSendAvtaltMetrikker } from '../avtaltHooks';
import { ForhaandsorienteringDialogProps, getForhaandsorienteringText } from '../utilsForhaandsorientering';
import AvtaltForm, { Handler } from './AvtaltForm';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: Aktivitet;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const AvtaltFormContainer = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, aktivitet, setForhandsorienteringType } = props;

    const bekreftStatus = useSelector(selectAktivitetFhoBekreftStatus);
    const nettverksStatus = useSelector(selectAktivitetStatus);

    const dispatch = useDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();
    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);
    const manglerTilDato = aktivitet.tilDato == null;

    const doSettAktivitetTilAvtalt = (avtaltAktivitet: Aktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt(avtaltAktivitet, forhaandsorientering));

    const onSubmit: Handler = (avtaltFormMapped: Values<ForhaandsorienteringDialogProps>) => {
        const avtaltForm: ForhaandsorienteringDialogProps = avtaltFormMapped as ForhaandsorienteringDialogProps;
        setSendtAtErAvtaltMedNav();
        const tekst = getForhaandsorienteringText(avtaltForm);
        doSettAktivitetTilAvtalt(aktivitet, { type: avtaltForm.forhaandsorienteringType, tekst });
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
                className="aktivitetvisning__underseksjon avtalt-container"
                oppdaterer={bekreftStatus === STATUS.RELOADING}
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                manglerTilDato={manglerTilDato}
                lasterData={nettverksStatus !== STATUS.OK}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </>
    );
};

export default AvtaltFormContainer;
