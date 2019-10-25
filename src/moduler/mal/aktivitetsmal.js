import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { formaterDatoEllerTidSiden } from '../../utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../felles-komponenter/accordion/accordion';
import { MalModal } from './aktivitetsmal-modal';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import { hentMal, selectMalStatus, selectGjeldendeMal } from './aktivitetsmal-reducer';
import { selectMalListe, selectMalListeStatus } from './aktivitetsmal-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { hentMalListe } from './malliste-reducer';
import { selectErVeileder } from '../identitet/identitet-selector';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import './aktivitetsmal.less';
import AktivitetsmalForm from './aktivitetsmal-form';
import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';

const identitetMap = (erVeileder, endretAv) => {
    if (erVeileder) {
        return { BRUKER: 'bruker', VEILEDER: 'NAV' }[endretAv];
    }
    return { BRUKER: 'deg', VEILEDER: 'NAV' }[endretAv];
};

function malListeVisning(gjeldendeMal, erVeileder) {
    return (
        <article key={gjeldendeMal.dato} className="aktivitetmal__historikk">
            <span className="aktivitetmal__historikk-skrevetav">
                {gjeldendeMal.mal ? 'Skrevet av ' : 'Mål slettet av '}
                <span>{identitetMap(erVeileder, gjeldendeMal.endretAv)}</span>
            </span>
            {` ${formaterDatoEllerTidSiden(gjeldendeMal.dato)}`}
            <Tekstomrade className="aktivitetmal__historikk-tekst">{gjeldendeMal.mal || ''}</Tekstomrade>
        </article>
    );
}

function Malvisning({ onClick }) {
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const historiskVisning = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    const mal = malData && malData.mal;
    const malText = historiskVisning && historiskeMal.length === 0 ? 'Det ble ikke skrevet mål i denne perioden' : mal;

    return (
        <div className="aktivitetmal__innhold">
            <Tekstomrade className="aktivitetmal__tekst">{malText}</Tekstomrade>
            <HiddenIfHovedknapp
                onClick={onClick}
                hidden={historiskVisning}
                disabled={!harSkriveTilgang || !underOppfolging}
            >
                Rediger
            </HiddenIfHovedknapp>
        </div>
    );
}

function MalHistorikk() {
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);

    if (historiskeMal.length === 0) {
        return null;
    }

    return (
        <>
            <hr className="aktivitetmal__delelinje" />
            <div className="aktivitetmal__footer">
                <Accordion openText="Skjul tidligere lagrede mål" closeText="Vis tidligere lagrede mål">
                    {historiskeMal.map(m => malListeVisning(m, erVeileder))}
                </Accordion>
            </div>
        </>
    );
}

function MalContainer() {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);

    const mal = malData && malData.mal;

    const [edit, setEdit] = useState(!viserHistoriskPeriode && !mal && underOppfolging);

    if (edit) {
        return (
            <AktivitetsmalForm
                mal={mal}
                handleComplete={() => {
                    setEdit(false);
                    loggMittMalLagre(erVeileder);
                }}
            />
        );
    }

    return <Malvisning onClick={() => setEdit(true)} />;
}

function AktivitetsMal() {
    const malStatus = useSelector(selectMalStatus, shallowEqual);
    const malListeStatus = useSelector(selectMalListeStatus, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentMal());
        dispatch(hentMalListe());
    }, [dispatch]);

    const avhengigheter = [malStatus, malListeStatus];

    return (
        <MalModal>
            <Innholdstittel className="aktivitetmal__header">
                {viserHistoriskPeriode ? 'Ditt mål fra en tidligere periode' : 'Ditt mål'}
            </Innholdstittel>
            <Undertekst className="aktivitetmal__sub-header">
                Beskriv målet ditt, gjerne både kortsiktige og langsiktige mål og hva slags arbeidsoppgaver du ønsker
                deg.
            </Undertekst>
            <Innholdslaster avhengigheter={avhengigheter} alleOK>
                <section className="aktivitetmal">
                    <MalContainer />
                    <MalHistorikk />
                </section>
            </Innholdslaster>
        </MalModal>
    );
}

export default AktivitetsMal;
