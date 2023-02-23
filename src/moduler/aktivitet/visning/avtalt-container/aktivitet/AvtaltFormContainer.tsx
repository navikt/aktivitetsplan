import { Values } from '@nutgaard/use-formstate';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../../../../api/utils';
import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectAktivitetFhoBekreftStatus, selectAktivitetStatus } from '../../../aktivitet-selector';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from '../arena-aktivitet/KanIkkeLeggeTilForhaandsorienteringInfotekst';
import { useSendAvtaltMetrikker } from '../avtaltHooks';
import { ForhaandsorienteringDialogProps, getForhaandsorienteringText } from '../utilsForhaandsorientering';
import AvtaltForm, { Handler } from './AvtaltForm';
import ForhaandsorienteringForm from './ForhaandsorienteringForm';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: VeilarbAktivitet;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const AvtaltFormContainer = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, aktivitet, setForhandsorienteringType } = props;

    const bekreftStatus = useSelector(selectAktivitetFhoBekreftStatus);
    const nettverksStatus = useSelector(selectAktivitetStatus);

    const dispatch = useDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();
    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    const doSettAktivitetTilAvtalt = (avtaltAktivitet: VeilarbAktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt(avtaltAktivitet, forhaandsorientering) as unknown as AnyAction);

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
            {aktivitet.avtalt && aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                mindreEnnSyvDagerTil ? (
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst />
                ) : (
                    <ForhaandsorienteringForm
                        setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
                        aktivitet={aktivitet}
                        hidden={mindreEnnSyvDagerTil}
                        setForhandsorienteringType={setForhandsorienteringType}
                    />
                )
            ) : (
                <AvtaltForm
                    oppdaterer={bekreftStatus === STATUS.RELOADING}
                    mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                    manglerTilDato={!aktivitet.tilDato}
                    lasterData={nettverksStatus !== STATUS.OK}
                    onSubmit={onSubmit}
                />
            )}
        </>
    );
};

export default AvtaltFormContainer;
