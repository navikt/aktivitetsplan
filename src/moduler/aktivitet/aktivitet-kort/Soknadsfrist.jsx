import React from 'react'
import {Normaltekst} from "nav-frontend-typografi";
import * as PT from "../../../proptypes";
import {getAntallDager, formaterDato, HiddenIf} from "../../../utils";

function Soknadfrist({aktivitet}) {
    const { tilDato, etikett } = aktivitet;
    const getClassName = frist => frist > 14? "": "aktivitetskort__frist";

    function getTekst(frist) {
        switch (frist) {
            case 0: return "Søknadsfristen går ut i dag";
            case 1: return "Søknadsfristen går ut i morgen";
            case frist < 0: return "Søknadsfristen har gått ut";
            case frist < 14: return `Søknadsfristen går ut om ${frist} dager`;
            default:
                return `Søknadsfrist: ${formaterDato(tilDato)}`;
        }
    }

    function getJsx() {
        const frist = getAntallDager(new Date(), new Date(tilDato));
        return (
            <Normaltekst className={getClassName(frist)}>
                {getTekst(frist)}
            </Normaltekst>
        )
    }

    return (
        <HiddenIf hidden={etikett || !tilDato}>
            {getJsx()}
        </HiddenIf>
    )
}

Soknadfrist.propTypes = {
    aktivitet: PT.aktivitet.isRequired,
};

export default Soknadfrist;
