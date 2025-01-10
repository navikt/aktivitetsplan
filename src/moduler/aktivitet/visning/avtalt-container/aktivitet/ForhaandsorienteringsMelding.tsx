import { BodyShort, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { UseFormRegister } from 'react-hook-form/dist/types/form';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';
import { ForhaandsorienteringDialogFormValues } from './AvtaltForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { DirtyContext } from '../../../../context/dirty-context';

interface Props {
    oppdaterer: boolean;
    avtaltText119: string;
    register: UseFormRegister<ForhaandsorienteringDialogFormValues>;
    errors: FieldErrors<ForhaandsorienteringDialogFormValues>;
}

const schema = z.object({
    forhaandsorienteringType: z.nativeEnum(ForhaandsorienteringType)
});

export type ForhaansorienteringFormValues = z.infer<typeof schema>;

const ForhaandsorienteringsMelding = (props: Props) => {
    const { oppdaterer, avtaltText119, register, errors } = props;
    const [forhaandsorienteringTypeState, setForhaandsorienteringTypeState] = useState<ForhaandsorienteringType>();

    const {
        setValue,
        formState: { isDirty, isSubmitting }
    } = useForm<ForhaansorienteringFormValues>({ resolver: zodResolver(schema), shouldFocusError: true });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('forhaandsorienteringType', isDirty);
        console.log("isDirty ", isDirty)
    }, [setFormIsDirty, isDirty]);

    const disable = isSubmitting || oppdaterer;

    const onChangeForhaandsorienteringType = (value: ForhaandsorienteringType) => {
        setValue('forhaandsorienteringType', value);
        setForhaandsorienteringTypeState(value)
    };

    return (
        <form>
            <RadioGroup legend="Velg type forhåndsorientering"
                        disabled={disable}
                        onChange={onChangeForhaandsorienteringType}>
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</Radio>
                <Radio value={ForhaandsorienteringType.IKKE_SEND}>Ingen forhåndsorientering</Radio>
            </RadioGroup>
            <VisibleIfDiv visible={forhaandsorienteringTypeState === ForhaandsorienteringType.SEND_STANDARD}>
                <Label>Teksten som blir lagt til aktiviteten:</Label>
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
                <VarslingInfo />
            </VisibleIfDiv>
            <VisibleIfDiv visible={forhaandsorienteringTypeState === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label="Teksten som blir lagt til aktiviteten"
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                    error={(errors as any).avtaltText119 && (errors as any).avtaltText119.message}
                />
                <VarslingInfo />
            </VisibleIfDiv>
        </form>
    );
};

export default ForhaandsorienteringsMelding;
