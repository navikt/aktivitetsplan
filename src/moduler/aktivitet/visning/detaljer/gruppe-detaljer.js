import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
    formaterDatoKortManedTid,
    formaterTid,
    HiddenIf,
} from '../../../../utils';
import Informasjonsfelt, {
    HiddenIfInformasjonsfelt,
} from '../hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../../../proptypes';
import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';

const Motaplan = planListe =>
    planListe.map(mote =>
        <Normaltekst key={mote.startDato}>
            {formaterDatoKortManedTid(mote.startDato)}
            {formaterTid(mote.sluttDato) === '00:00'
                ? ''
                : ` - ${formaterTid(mote.sluttDato)}`},
            {` ${mote.sted}`}
        </Normaltekst>
    );

function GruppeDetaljer({ aktivitet }) {
    const { fraDato, tilDato, moeteplanListe } = aktivitet;
    const erGruppeDatoLike = fraDato === tilDato;

    return (
        <HiddenIf hidden={aktivitet.type !== GRUPPE_AKTIVITET_TYPE}>
            <div className="aktivitetvisning__detaljer">
                <HiddenIfInformasjonsfelt
                    hidden={erGruppeDatoLike}
                    key="fradato"
                    tittel={
                        <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />
                    }
                    innhold={fraDato || 'Dato ikke satt'}
                />
                <HiddenIfInformasjonsfelt
                    hidden={erGruppeDatoLike}
                    key="tildato"
                    tittel={
                        <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.default" />
                    }
                    innhold={tilDato || 'Dato ikke satt'}
                />
                <HiddenIfInformasjonsfelt
                    hidden={!erGruppeDatoLike}
                    key="likeGruppeDato"
                    tittel={
                        <FormattedMessage id="aktivitetdetaljer.dato-tekst.gruppeaktivitet" />
                    }
                    innhold={fraDato || 'Dato ikke satt'}
                />
                <Informasjonsfelt
                    key="moteplanutenslutteklokke"
                    tittel={
                        <FormattedMessage id="aktivitetdetaljer.moteplan-label" />
                    }
                    beskrivelse
                    innhold={<Motaplan planListe={moeteplanListe} />}
                />
                <Informasjonsfelt
                    tittel={
                        <FormattedMessage id="aktivitetvisning.beskrivelse-label" />
                    }
                    innhold={aktivitet.beskrivelse}
                    beskrivelse
                    fullbredde
                    formattertTekst
                />
            </div>
        </HiddenIf>
    );
}

GruppeDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default GruppeDetaljer;
