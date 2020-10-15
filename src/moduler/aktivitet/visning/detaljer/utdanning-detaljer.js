import React from 'react';
import * as AppPT from '../../../../proptypes';
import { HiddenIf } from '../../../../utils';
import { UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const UtdanningDetaljer = ({ aktivitet }) => (
    <HiddenIf hidden={aktivitet.type !== UTDANNING_AKTIVITET_TYPE}>
        <div className="aktivitetvisning__detaljer">
            <FraDato aktivitet={aktivitet} visIkkeSatt />
            <TilDato aktivitet={aktivitet} visIkkeSatt />
            <Beskrivelse aktivitet={aktivitet} />
        </div>
    </HiddenIf>
);

UtdanningDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default UtdanningDetaljer;
