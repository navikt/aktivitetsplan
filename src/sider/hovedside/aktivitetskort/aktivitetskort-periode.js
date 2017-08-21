import React from 'react';
import {MOTE_TYPE} from '../../../constant';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterDato } from '../../../utils';
import * as PT from "../../../proptypes";


function AktiviteskortPeriodeVisning({aktivitet}){
    const {type, fraDato, tilDato} = aktivitet;
    function periodeVisning() {
        if (type === MOTE_TYPE){
            return formaterDato(fraDato)
        }
        return [formaterDato(fraDato), formaterDato(tilDato)]
            .filter(d => d)
            .join(' - ');
    }
    return(
        <Normaltekst className="aktivitetskort__dato">
            {periodeVisning()}
        </Normaltekst>
    )
}



AktiviteskortPeriodeVisning.propTypes = {
    aktivitet : PT.aktivitet.isRequired
};

export default AktiviteskortPeriodeVisning;
