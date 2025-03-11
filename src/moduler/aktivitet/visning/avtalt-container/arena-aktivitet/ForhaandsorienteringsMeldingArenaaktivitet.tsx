import { BodyShort, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import React from 'react';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';
import { useFormContext } from 'react-hook-form';
import { ForhaandsorienteringFormValues } from '../aktivitet/ForhaandsorienteringForm';

interface Props {}

const ForhaandsorienteringsMeldingArenaaktivitet = (props: Props) => {
    const {
        setValue,
        register,
        watch,
        formState: { errors, isSubmitting, defaultValues },
    } = useFormContext<ForhaandsorienteringFormValues>();

    const avtaltText119 = watch('avtaltText119');
    const forhaandsorienteringType = watch('forhaandsorienteringType');

    const onChangeForhaandsorientering = (forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD | ForhaandsorienteringType.SEND_PARAGRAF_11_9) => {
        if (!forhaandsorienteringType) return;
        setValue('forhaandsorienteringType', forhaandsorienteringType);
    }

    return (
        <div className="space-y-8 my-4">
            <RadioGroup
                onChange={onChangeForhaandsorientering}
                defaultValue={defaultValues?.forhaandsorienteringType}
                legend="Velg type forhåndsorientering"
                disabled={isSubmitting}
                className="mt-4"
            >
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>
                    Forhåndsorientering (standard melding)
                </Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                    Forhåndsorientering for §11-9 (AAP)
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
        </div>
    );
};

export default ForhaandsorienteringsMeldingArenaaktivitet;
