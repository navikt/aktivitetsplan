import React from 'react';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import { formaterDatoKortManed } from '../../utils';
import Dato from '../../felles-komponenter/dato';
import BrukerAvhengigTekst from '../../felles-komponenter/brukeravhengigtekst';
import {
    TRANSAKSJON_TYPE_ETIKETT_ENDRET,
    TRANSAKSJON_TYPE_STATUS_ENDRET,
    TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET,
} from '../../constant';

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
        <p className="versjon-for-aktivitet__innslag">
            <b>
                <BrukerAvhengigTekst id={`lagtInnAv.${versjon.lagtInnAv}`} />
                {' '}
            </b>
            {endringsTekst()}
            <br />
            <Dato>
                {versjon.endretDato}
            </Dato>
        </p>
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
