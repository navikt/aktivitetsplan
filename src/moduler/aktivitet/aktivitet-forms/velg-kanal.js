import React from 'react';
import Select from '../../../felles-komponenter/skjema/input/select';

function VelgKanal(props) {
    return (
        <Select noBlankOption bredde="fullbredde" {...props}>
            <option value="OPPMOTE">Oppmøte</option>
            <option value="TELEFON">Telefonmøte</option>
            <option value="INTERNETT">Nettmøte</option>
        </Select>
    );
}

export default VelgKanal;
