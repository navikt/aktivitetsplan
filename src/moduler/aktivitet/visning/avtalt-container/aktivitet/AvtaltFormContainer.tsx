import { Values } from '@nutgaard/use-formstate';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../../utils';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectAktivitetFhoBekreftStatus, selectAktivitetStatus } from '../../../aktivitet-selector';
import aktivitetvisningStyles from './../../Aktivitetsvisning.module.less';
import aktivitetsvisningStyles from '../../Aktivitetsvisning.module.less';
import DeleLinje from '../../delelinje/delelinje';
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
            {aktivitet.avtalt && aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                <div className={aktivitetsvisningStyles.underseksjon}>
                    <KanIkkeLeggeTilForhaandsorienteringInfotekst merEnnSyvDagerTil={!mindreEnnSyvDagerTil} />
                    <ForhaandsorienteringForm
                        setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
                        aktivitet={aktivitet}
                        hidden={mindreEnnSyvDagerTil}
                        setForhandsorienteringType={setForhandsorienteringType}
                    />
                </div>
            ) : (
                <AvtaltForm
                    className={classNames(aktivitetvisningStyles.underseksjon, 'avtalt-container')}
                    oppdaterer={bekreftStatus === STATUS.RELOADING}
                    mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                    manglerTilDato={!aktivitet.tilDato}
                    lasterData={nettverksStatus !== STATUS.OK}
                    onSubmit={onSubmit}
                />
            )}
            <DeleLinje />
        </>
    );
};

export default AvtaltFormContainer;
