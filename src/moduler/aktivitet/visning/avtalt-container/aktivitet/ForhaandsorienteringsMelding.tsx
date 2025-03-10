import { BodyShort, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { UseFormRegister } from 'react-hook-form/dist/types/form';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';
import { ForhaandsorienteringDialogFormValues } from './AvtaltForm';

interface Props {
    register: UseFormRegister<ForhaandsorienteringDialogFormValues>;
    setValue: (forhaandsorienteringType: ForhaandsorienteringType) => void;
    oppdaterer: boolean;
    forhaandsorienteringType: ForhaandsorienteringType;
    avtaltText119: string;
    errors: FieldErrors<ForhaandsorienteringDialogFormValues>;
}

const ForhaandsorienteringsMelding = (props: Props) => {
    const { register, setValue, forhaandsorienteringType, oppdaterer, avtaltText119, errors } = props;

    const onChangeForhaandsorientering = (forhaandsorienteringType: ForhaandsorienteringType) => {
        setValue(forhaandsorienteringType);
    }
    return (
        <>
            <RadioGroup {...register('forhaandsorienteringType')} onChange={onChangeForhaandsorientering} legend="Velg type forhåndsorientering" disabled={oppdaterer} className="mt-4">
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>
                    Forhåndsorientering (standard melding)
                </Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                    Forhåndsorientering for §11-9 (AAP)
                </Radio>
                <Radio value={ForhaandsorienteringType.IKKE_SEND}>
                    Ingen forhåndsorientering
                </Radio>
            </RadioGroup>
            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD}>
                <Label>Teksten som blir lagt til aktiviteten</Label>
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
                <VarslingInfo />
            </VisibleIfDiv>
            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label="Teksten som blir lagt til aktiviteten"
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                    error={(errors as any).avtaltText119 && (errors as any).avtaltText119.message}
                />
                <VarslingInfo />
            </VisibleIfDiv>
        </>
    );
};

export default ForhaandsorienteringsMelding;
