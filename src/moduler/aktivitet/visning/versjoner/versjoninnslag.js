import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import * as AppPT from '../../../../proptypes';
import { formaterDatoKortManed, formaterDatoEllerTidSiden } from '../../../../utils';
import BrukerAvhengigTekst from '../../../../felles-komponenter/brukeravhengigtekst';
import {
    TRANSAKSJON_TYPE_ETIKETT_ENDRET,
    TRANSAKSJON_TYPE_STATUS_ENDRET,
    TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET,
} from '../../../../constant';

function VersjonInnslag({ versjon, prevVersjon }) {
    function endringsTekst() {
        const textId = `endringstype.${versjon.transaksjonsType}`;
        switch (versjon.transaksjonsType) {
            case TRANSAKSJON_TYPE_STATUS_ENDRET: {
                return (
                    <FormattedMessage
                        id={textId}
                        values={{
                            fra: prevVersjon.status,
                            til: versjon.status,
                        }}
                    />
                );
            }
            case TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET: {
                return (
                    <FormattedMessage
                        id={textId}
                        values={{
                            fra: formaterDatoKortManed(prevVersjon.tilDato),
                            til: formaterDatoKortManed(versjon.tilDato),
                        }}
                    />
                );
            }
            case TRANSAKSJON_TYPE_ETIKETT_ENDRET: {
                return (
                    <FormattedMessage
                        id={textId}
                        values={{
                            til: versjon.etikett ? versjon.etikett : 'INGEN',
                        }}
                    />
                );
            }
            default: {
                return <FormattedMessage id={textId} />;
            }
        }
    }

    return (
        <div className="versjon-for-aktivitet-innslag">
            <Element className="versjon-for-aktivitet-innslag__identitet">
                <BrukerAvhengigTekst id={`lagtInnAv.${versjon.lagtInnAv}`} endretAv={versjon.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst()}
            <Normaltekst>{formaterDatoEllerTidSiden(versjon.endretDato)}</Normaltekst>
        </div>
    );
}

VersjonInnslag.propTypes = {
    versjon: AppPT.aktivitet.isRequired,
    prevVersjon: AppPT.aktivitet,
};

VersjonInnslag.defaultProps = {
    prevVersjon: undefined,
};

export default VersjonInnslag;
