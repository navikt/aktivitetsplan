import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Select from '../../../felles-komponenter/skjema/input/select';

const kanaler = ['OPPMOTE', 'TELEFON', 'INTERNETT'];

function VelgKanal({ labelId, disabled }) {
    const lagkanalOption = kanal =>
        <FormattedMessage key={kanal} id={`kanal.${kanal}`.toLowerCase()}>
            {kanalTekst =>
                <option value={kanal}>
                    {kanalTekst}
                </option>}
        </FormattedMessage>;

    return (
        <Select
            feltNavn="kanal"
            noBlankOption
            disabled={disabled}
            labelId={labelId}
            bredde="fullbredde"
        >
            {kanaler.map(lagkanalOption)}
        </Select>
    );
}

VelgKanal.propTypes = {
    labelId: PT.string.isRequired,
    disabled: PT.bool,
};

VelgKanal.defaultProps = {
    disabled: false,
};

export default VelgKanal;
