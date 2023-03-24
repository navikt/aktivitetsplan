import { BodyShort, Button, Select, Textarea } from '@navikt/ds-react';
import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form/dist/types/form';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import { AVTALT_TEKST } from '../utilsForhaandsorientering';
import VarslingInfo from '../VarslingInfo';

interface Props {
    lasterData: boolean;
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
}

const ForhaandsorienteringsMeldingArenaaktivitet = (props: Props) => {
    const { lasterData, register, watch } = props;

    const forhaandsorienteringType = watch('forhaandsorienteringType');
    const avtaltText119 = watch('avtaltText119');

    return (
        <div className="space-y-8">
            <Select
                label="Velg type forhåndsorientering"
                disabled={lasterData}
                className="mt-4"
                {...register('forhaandsorienteringType')}
            >
                <option value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</option>
                <option value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</option>
            </Select>
            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD}>
                <VarslingInfo />
                <BodyShort className="blokk-xs">{AVTALT_TEKST}</BodyShort>
            </VisibleIfDiv>

            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea
                    label={<VarslingInfo />}
                    maxLength={500}
                    value={avtaltText119}
                    {...register('avtaltText119')}
                />
            </VisibleIfDiv>

            <Button loading={lasterData}>Bekreft</Button>
        </div>
    );
};

export default ForhaandsorienteringsMeldingArenaaktivitet;
