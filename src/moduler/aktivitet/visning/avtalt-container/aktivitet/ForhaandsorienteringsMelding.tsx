import { BodyShort, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { UseFormRegister } from 'react-hook-form/dist/types/form';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';
import { ForhaandsorienteringDialogFormValues } from './AvtaltForm';

interface Props {
    register: UseFormRegister<ForhaandsorienteringDialogFormValues>;
    oppdaterer: boolean;
    forhaandsorienteringType: ForhaandsorienteringType;
    avtaltText119: string;
    errors: FieldErrors<ForhaandsorienteringDialogFormValues>;
}

const ForhaandsorienteringsMelding = (props: Props) => {
    const { register, oppdaterer, avtaltText119, errors } = props;
    const [error, setError] = useState("");
    const [selectedType, setForhaandsorienteringType] = useState<string | null>(null);

    const valgtforhandsorientering = (val: string) => {
        setForhaandsorienteringType(val);
        setError("");
    };

    const handleSubmit = () => {
        if (!selectedType) {
            setError("Du må velge en type forhåndsorientering før du kan gå videre.");
            return;
        }
    };

    return (
        <>
            <RadioGroup
                legend="Velg type forhåndsorientering"
                disabled={oppdaterer}
                className="mt-4"
                value={selectedType}
                error={error}
                onChange={valgtforhandsorientering}
            >
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</Radio>
                <Radio value={ForhaandsorienteringType.IKKE_SEND}>Ingen forhåndsorientering</Radio>
            </RadioGroup>

            <VisibleIfDiv visible={selectedType === ForhaandsorienteringType.SEND_STANDARD}>
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
                <br />
                <VarslingInfo />
            </VisibleIfDiv>

            <VisibleIfDiv visible={selectedType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label={"Teksten som blir lagt til aktiviteten:"}
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                    error={(errors as any).avtaltText119 && (errors as any).avtaltText119.message}
                />
                <br />
                <VarslingInfo />
            </VisibleIfDiv>
        </>
    );
};

export default ForhaandsorienteringsMelding;
