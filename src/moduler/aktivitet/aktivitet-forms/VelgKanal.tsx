import React from 'react';

import { Kanal } from '../../../datatypes/aktivitetTypes';
import Select from '../../../felles-komponenter/skjema/input/Select';

const VelgKanal = (props: any) => (
    <Select noBlankOption bredde="fullbredde" {...props} required>
        <option value={Kanal.OPPMOTE}>Oppmøte</option>
        <option value={Kanal.TELEFON}>Telefonmøte</option>
        <option value={Kanal.INTERNET}>Videomøte</option>
    </Select>
);

export default VelgKanal;
