import { Values } from '@nutgaard/use-formstate';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../api/utils';
import { Aktivitet, Forhaandsorientering, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import { settAktivitetTilAvtalt } from '../../aktivitet-actions';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import DeleLinje from '../delelinje/delelinje';
import AvtaltForm, { Handler } from './AvtaltForm';
import { useSendAvtaltMetrikker } from './avtaltHooks';
import { ForhaandsorienteringDialogProps, getForhaandsorienteringText } from './utilsForhaandsorientering';

interface Props {
    setSendtAtErAvtaltMedNav(value: boolean): void;
    aktivitet: Aktivitet;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const AvtaltFormContainer = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, aktivitet, setForhandsorienteringType } = props;

    const nettverksStatus = useSelector(selectAktivitetStatus);

    const dispatch = useDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();
    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

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
                className="aktivitetvisning__underseksjon avtalt-container"
                oppdaterer={nettverksStatus === STATUS.RELOADING}
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                lasterData={nettverksStatus !== STATUS.OK}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </>
    );
};

export default AvtaltFormContainer;
