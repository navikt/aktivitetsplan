import { BodyShort, Button, Label, Radio, RadioGroup, Select, Textarea } from '@navikt/ds-react';
import React, { useState } from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form/dist/types/form';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { ForhaandsorienteringFormValues } from '../aktivitet/ForhaandsorienteringForm';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';

interface Props {
    lasterData: boolean;
    register: UseFormRegister<ForhaandsorienteringFormValues>;
    watch: UseFormWatch<ForhaandsorienteringFormValues>;
}

const ForhaandsorienteringsMeldingArenaaktivitet = (props: Props) => {
    const { lasterData, register, watch } = props;
    const [radioValue, setRadioValue] = useState("");

    const onChangeForhaandsorientering = (value: ForhaandsorienteringType) => {
        setRadioValue(value);
    }

    const forhaandsorienteringType = watch('forhaandsorienteringType');
    const avtaltText119 = watch('avtaltText119');

    return (
        <div className="space-y-8 my-4">
            <RadioGroup {...register('forhaandsorienteringType')} defaultValue={radioValue} onChange={onChangeForhaandsorientering} legend="Velg type forhåndsorientering" disabled={lasterData} className="mt-4">
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>
                    Forhåndsorientering (standard melding)
                </Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                    Forhåndsorientering for §11-9 (AAP)
                </Radio>
            </RadioGroup>
            <VisibleIfDiv visible={radioValue === ForhaandsorienteringType.SEND_STANDARD}>
                <Label>Teksten som blir lagt til aktiviteten</Label>
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
                <VarslingInfo />
            </VisibleIfDiv>

            <VisibleIfDiv visible={radioValue === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label="Teksten som blir lagt til aktiviteten"
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                />
                <VarslingInfo />
            </VisibleIfDiv>

            <Button loading={lasterData}>Legg til</Button>
        </div>
    );
};

export default ForhaandsorienteringsMeldingArenaaktivitet;
