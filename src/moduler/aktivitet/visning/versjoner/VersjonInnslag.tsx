import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Aktivitet, TransaksjonsType } from '../../../../datatypes/aktivitetTypes';
import BrukeravhengigTekst from '../../../../felles-komponenter/BrukeravhengigTekst';
import { formaterDatoEllerTidSiden, formaterDatoKortManed } from '../../../../utils';

interface Props {
    versjon: Aktivitet,
    prevVersjon?: Aktivitet
}


const VersjonInnslag = (props: Props) => {
    const {versjon, prevVersjon} = props;

    const endringsTekst = () => {
        const textId = `endringstype.${versjon.transaksjonsType}`;
        switch (versjon.transaksjonsType) {
            case TransaksjonsType.MOTE_TID_OG_STED_ENDRET:
            case TransaksjonsType.REFERAT_OPPRETTET:
            case TransaksjonsType.REFERAT_ENDRET:
            case TransaksjonsType.REFERAT_PUBLISERT:
            case TransaksjonsType.BLE_HISTORISK:
            case TransaksjonsType.DETALJER_ENDRET:
            case TransaksjonsType.AVTALT:
            case TransaksjonsType.OPPRETTET:
                return <FormattedMessage id={textId} />;
            case TransaksjonsType.AVTALT_DATO_ENDRET: {
                return (
                    <FormattedMessage
                        id={textId}
                        values={{
                            fra: formaterDatoKortManed(prevVersjon ? prevVersjon.tilDato : undefined),
                            til: formaterDatoKortManed(versjon.tilDato),
                        }}
                    />
                );
            }
            case TransaksjonsType.STATUS_ENDRET: {
                return (
                    <FormattedMessage
                        id={textId}
                        values={{
                            fra: prevVersjon ? prevVersjon.status : undefined,
                            til: versjon.status,
                        }}
                    />
                );
            }

            case TransaksjonsType.ETIKETT_ENDRET: {
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
                <BrukeravhengigTekst id={`lagtInnAv.${versjon.lagtInnAv}`} endretAv={versjon.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst()}
            <Normaltekst>{formaterDatoEllerTidSiden(versjon.endretDato)}</Normaltekst>
        </div>
    );
}

export default VersjonInnslag;
