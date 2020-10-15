import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { formaterDatoKortManed, formaterDatoKortManedTid, formaterTid, HiddenIf } from '../../../../utils';
import Informasjonsfelt, { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const Motaplan = (planListe) => (
    <span>
        {planListe.planListe.map((mote) => (
            <Normaltekst key={mote.startDato} tag="span">
                {formaterDatoKortManedTid(mote.startDato)}
                {formaterTid(mote.sluttDato) === '00:00' ? '' : ` - ${formaterTid(mote.sluttDato)}`},{` ${mote.sted}`}
            </Normaltekst>
        ))}
    </span>
);

function GruppeDetaljer({ aktivitet }) {
    const { fraDato, tilDato, moeteplanListe } = aktivitet;
    const erGruppeDatoLike = formaterDatoKortManed(fraDato) === formaterDatoKortManed(tilDato);

    return (
        <HiddenIf hidden={aktivitet.type !== GRUPPE_AKTIVITET_TYPE}>
            <div className="aktivitetvisning__detaljer">
                <FraDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
                <TilDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
                <HiddenIfInformasjonsfelt
                    hidden={!erGruppeDatoLike}
                    key="likeGruppeDato"
                    tittel={<FormattedMessage id="aktivitetdetaljer.dato-tekst.gruppeaktivitet" />}
                    innhold={formaterDatoKortManed(fraDato) || 'Dato ikke satt'}
                />
                <Informasjonsfelt
                    key="moteplanutenslutteklokke"
                    tittel={<FormattedMessage id="aktivitetdetaljer.moteplan-label" />}
                    beskrivelse
                    innhold={<Motaplan planListe={moeteplanListe} />}
                />
                <Beskrivelse aktivitet={aktivitet} />
            </div>
        </HiddenIf>
    );
}

GruppeDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default GruppeDetaljer;
