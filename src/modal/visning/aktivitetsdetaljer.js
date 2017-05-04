import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { Link } from 'react-router';
import * as AppPT from '../../proptypes';
import { formaterDatoKortManad, formaterDatoKortManedTid, formaterTid } from '../../utils';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE } from '../../constant';
import DetaljFelt from './detalj-felt';

function RedigerLink({ id, felt }) {
    return (
        <Link to={`/aktivitet/aktivitet/${id}/endre`}>
            <FormattedMessage id="aktivitetsdetaljer.legg-til-felt" values={{ felt }} />
        </Link>
    );
}

RedigerLink.propTypes = {
    id: PT.string.isRequired,
    felt: PT.string.isRequired
};

function Informasjonsfelt({ tittel, innhold }) {
    return (
        <DetaljFelt tittel={tittel} visible={innhold != null}>
            <Normaltekst className="detaljfelt__tekst">{innhold}</Normaltekst>
        </DetaljFelt>
    );
}

function Aktivitetsdetaljer({ valgtAktivitet, className }) {
    const { type: aktivitetstype, lenke, arbeidsgiver, arbeidssted, kontaktperson, hensikt,
        tiltaksarrangor, deltakelsesprosent, dagerPerUke, gruppeAktivitetSted, gruppeAktivitetStatus, moteplan, id } = valgtAktivitet;

    const fraDato = formaterDatoKortManad(valgtAktivitet.fraDato);
    const tilDato = formaterDatoKortManad(valgtAktivitet.tilDato);

    const fraDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return 'Fra dato';
            case STILLING_AKTIVITET_TYPE:
                return 'Startdato';
            default:
                return 'Fra dato';
        }
    };

    const tilDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return 'Til dato';
            case STILLING_AKTIVITET_TYPE:
                return 'Søknadsfrist';
            default:
                return 'Til dato';
        }
    };

    const httpRegex = /^(https?):\/\/.*$/;

    const lenkeKomponent = () => (
        <DetaljFelt key="lenke" tittel="Lenke" visible={lenke != null}>
            <Link
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
                target="_blank"
            >
                {lenke}
            </Link>
        </DetaljFelt>
    );

    const ledigStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={arbeidsgiver} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={arbeidssted} id={id} />,
            lenkeKomponent(),
            <Informasjonsfelt key="kontaktperson" tittel="kontaktperson" innhold={kontaktperson} id={id} />
        ]
    );

    const egenStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            lenkeKomponent(),
            <Informasjonsfelt key="hensikt" tittel="hensikt" innhold={hensikt} id={id} />
        ]
    );

    const tiltakFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            <Informasjonsfelt key="tiltaksarrangor" tittel="Tiltaksarrangør" innhold={tiltaksarrangor} id={id} />,
            <Informasjonsfelt key="deltakelsesprosent" tittel="Deltakelsesprosent" innhold={deltakelsesprosent + '%'} id={id} />,
            <Informasjonsfelt key="dagerPerUke" tittel="Antall dager per uke" innhold={dagerPerUke} id={id} />
        ]
    );

    const gruppeFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            <Informasjonsfelt key="gruppeAktivitetSted" tittel="Sted" innhold={gruppeAktivitetSted} id={id} />,
            <Informasjonsfelt key="gruppeAktivitetStatus" tittel="Status" innhold={gruppeAktivitetStatus} id={id} />,
            <section className="aktivitetsbeskrivelse">
                <Element className="aktivitetsbeskrivelse__tittel">Møteplan</Element>
                {moteplan.map((mote) => (
                    <Normaltekst key={mote.start} className="detaljfelt__tekst">{formaterDatoKortManedTid(mote.start)} - {formaterTid(mote.stop)}, på {mote.sted}</Normaltekst>
                ))}
            </section>
        ]
    );

    const utdanningFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
        ]
    );

    const map = {
        [EGEN_AKTIVITET_TYPE]: egenStillingFelter,
        [STILLING_AKTIVITET_TYPE]: ledigStillingFelter,
        [TILTAK_AKTIVITET_TYPE]: tiltakFelter,
        [GRUPPE_AKTIVITET_TYPE]: gruppeFelter,
        [UTDANNING_AKTIVITET_TYPE]: utdanningFelter
    };

    const cls = (clsName) => classNames(clsName, 'aktivitetsdetaljer');
    return (
        <section className={cls(className)}>
            {map[aktivitetstype]()}
        </section>
    );
}

Informasjonsfelt.propTypes = {
    tittel: PT.string,
    innhold: PT.string
};

Aktivitetsdetaljer.propTypes = {
    className: PT.string,
    valgtAktivitet: AppPT.aktivitet.isRequired
};

export default Aktivitetsdetaljer;
