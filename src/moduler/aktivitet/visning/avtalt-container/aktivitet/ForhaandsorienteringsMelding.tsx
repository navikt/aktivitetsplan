import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import Select from '../../../../../felles-komponenter/skjema/input/Select';
import Textarea from '../../../../../felles-komponenter/skjema/input/Textarea';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import VarslingInfo from '../VarslingInfo';
import styles from './ForhaandsorienteringsMelding.module.less';

interface Props {
    hidden: boolean;
    oppdaterer: boolean;
    state: any;
}

const ForhaandsorienteringsMelding = (props: Props) => {
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
                className={styles.selectType}
                noBlankOption
                {...state.fields.forhaandsorienteringType}
            >
                <option value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</option>
                <option value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</option>
                <option value={ForhaandsorienteringType.IKKE_SEND}>Ingen forhåndsorientering</option>
            </Select>
            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD}>
                <VarslingInfo />
                <BodyShort className="blokk-xs">
                    Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at
                    stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre
                    aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.
                </BodyShort>
            </VisibleIfDiv>
            <VisibleIfDiv visible={forhaandsorienteringType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea label={<VarslingInfo />} maxLength={500} {...state.fields.avtaltText119} />
            </VisibleIfDiv>
        </>
    );
};

export default ForhaandsorienteringsMelding;
