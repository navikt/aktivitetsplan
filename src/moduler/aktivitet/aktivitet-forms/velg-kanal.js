import React from 'react';
import Select from '../../../felles-komponenter/skjema/input/select';
import { INTERNET_KANAL, OPPMOTE_KANAL, TELEFON_KANAL } from '../../../constant';

function VelgKanal(props) {
    return (
        <Select noBlankOption bredde="fullbredde" {...props}>
            <option value={OPPMOTE_KANAL}>Oppmøte</option>
            <option value={TELEFON_KANAL}>Telefonmøte</option>
            <option value={INTERNET_KANAL}>Videomøte</option>
        </Select>
    );
}

export default VelgKanal;
