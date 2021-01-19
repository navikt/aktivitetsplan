import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import Select from '../../../../felles-komponenter/skjema/input/select';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { IKKE_SEND_FORHAANDSORIENTERING, SEND_FORHAANDSORIENTERING, SEND_PARAGRAF_11_9 } from './AvtaltForm';
import VarslingInfo from './VarslingInfo';

interface Props {
    hidden: boolean;
    oppdaterer: boolean;
    state: any;
}

const ForhaandsorienteringMelding = (props: Props) => {
    const { hidden, oppdaterer, state } = props;
    const forhaandsorienteringType = state.fields.forhaandsorienteringType.input.value;

    if (hidden) {
        return null;
    }

    return (
        <>
            <Select
                label="Velg type forhåndsorientering"
                disabled={oppdaterer}
                noBlankOption
                {...state.fields.forhaandsorienteringType}
            >
                <option value={SEND_FORHAANDSORIENTERING}>Send forhåndsorientering (standard melding)</option>
                <option value={SEND_PARAGRAF_11_9}>Send forhåndsorientering for §11-9 (AAP)</option>
                <option value={IKKE_SEND_FORHAANDSORIENTERING}>Ikke send forhåndsorientering</option>
            </Select>
            <VisibleIfDiv visible={forhaandsorienteringType === SEND_FORHAANDSORIENTERING}>
                <VarslingInfo />
                <Normaltekst className="blokk-xs">
                    Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at
                    stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre
                    aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.
                </Normaltekst>
            </VisibleIfDiv>
            <VisibleIfDiv visible={forhaandsorienteringType === SEND_PARAGRAF_11_9}>
                <Textarea label={<VarslingInfo />} maxLength={500} {...state.fields.avtaltText119} />
            </VisibleIfDiv>
        </>
    );
};

export default ForhaandsorienteringMelding;
