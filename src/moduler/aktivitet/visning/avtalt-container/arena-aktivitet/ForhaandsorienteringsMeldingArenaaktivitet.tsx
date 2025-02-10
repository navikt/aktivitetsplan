import { BodyShort, Button, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
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

    const avtaltText119 = watch('avtaltText119');
    const [forhaandsorienteringType, setForhaandsorienteringType] = useState<string | null>(null);
    const [error, setError] = useState("");

    const valgtforhandsorientering = (val: string) => {
        setForhaandsorienteringType(val);
        setError("");
    };

    const handleSubmit = () => {
        if (!forhaandsorienteringType) {
            setError("Du må velge en type forhåndsorientering før du kan gå videre.");
            register('forhaandsorienteringType')
            return;
        }
    };

    return (
        <div className="space-y-8">
            <RadioGroup
                onChange={valgtforhandsorientering}
                legend="Velg type forhåndsorientering"
                disabled={lasterData}
                className="mt-4"
                error={error}
            >
                <Radio value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</Radio>
                <Radio value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</Radio>
            </RadioGroup>

            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD}>
                <Label>Teksten som blir lagt til aktiviteten:</Label>
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
                <br/>
                <VarslingInfo />
            </VisibleIfDiv>

            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label={"Teksten som blir lagt til aktiviteten:"}
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                />
                <br/>
                <VarslingInfo />
            </VisibleIfDiv>

            <Button loading={lasterData} onClick={handleSubmit}>Legg til</Button>
        </div>
    );
};

export default ForhaandsorienteringsMeldingArenaaktivitet;
