import React, { FunctionComponent, useEffect } from 'react';
import { BodyShort, Button, Heading, Label, List, Select } from '@navikt/ds-react';
import { Link as ReactRouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    hentPdfTilForhaandsvisning,
    journalfør,
    selectForhaandsvisningOpprettet,
    selectForhaandsvisningStatus,
    selectJournalføringstatus,
    selectSistJournalfort,
} from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routing/useRoutes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { formaterDatoKortManed, formaterTid } from '../../utils/dateUtils';
import { useFnrOgEnhetContext } from '../../Provider';
import { logKlikkKnapp } from '../../amplitude/amplitude';

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const { oppfolgingsperiodeId } = useParams<{ oppfolgingsperiodeId: string }>();
    const oppfolgingsperioder = useSelector(selectOppfolgingsPerioder);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);
    const sistJournalfort = useSelector(selectSistJournalfort);
    const forhaandsvisningStatus = useSelector(selectForhaandsvisningStatus);
    const journalføringsStatus = useSelector(selectJournalføringstatus);
    const henterForhaandsvisning = [Status.PENDING, Status.RELOADING].includes(forhaandsvisningStatus);
    const journalfører = [Status.PENDING, Status.RELOADING].includes(journalføringsStatus);
    const { hovedsideRoute } = useRoutes();
    const navigate = useNavigate();
    const { aktivEnhet: journalførendeEnhet } = useFnrOgEnhetContext();

    if (!journalførendeEnhet || !oppfolgingsperiodeId) {
        throw new Error('Kan ikke arkivere når aktiv enhet ikke er valgt');
    }

    useEffect(() => {
        if (!journalførendeEnhet || !oppfolgingsperiodeId) return;

        dispatch(hentPdfTilForhaandsvisning({ journalførendeEnhet, oppfolgingsperiodeId }));
    }, [oppfolgingsperiodeId, dispatch, journalførendeEnhet]);

    const sendTilArkiv = () => {
        logKlikkKnapp('Journalfør aktivitetsplan')
        if (forhaandsvisningOpprettet) {
            dispatch(journalfør({ forhaandsvisningOpprettet, journalførendeEnhet, oppfolgingsperiodeId }));
        }
    };

    const onEndretOppfolgingsperiode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valgtOppfølgingsperiode = e.target.value;
        navigate(`/aktivitetsplan/journalforing/${valgtOppfølgingsperiode}`, { replace: true });
    };

    const disabled = henterForhaandsvisning || !forhaandsvisningOpprettet || journalfører;

    const sistJournalførtTekst = (): string => {
        if (forhaandsvisningStatus == Status.ERROR) {
            return 'Kunne ikke hente sist journalført';
        } else if (forhaandsvisningStatus == Status.OK) {
            return sistJournalfort
                ? formaterDatoKortManed(sistJournalfort) + ' kl. ' + formaterTid(sistJournalfort)
                : 'Aldri';
        } else {
            return '';
        }
    };

    return (
        <div className="items-start space-y-4 max-w-96 py-8 px-8 bg-white md:sticky top-0 h-screen">
            <ReactRouterLink
                className="text-text-action underline hover:no-underline"
                to={hovedsideRoute()}
                tabIndex={0}
            >
                Til aktivitetsplanen
            </ReactRouterLink>
            <Heading size="large">Journalføring</Heading>
            <div className="print:border-none space-y-8 flex flex-col pb-4">
                <List as="ul" title="Dette er ikke inkludert i journalføringen:" size="small">
                    <List.Item>Aktiviteter og dialog tilknyttet KVP</List.Item>
                    <List.Item>Samtalereferat som ikke er delt med bruker</List.Item>
                </List>
                <Select
                    label="Oppfølgingsperiode"
                    onChange={onEndretOppfolgingsperiode}
                    disabled={disabled}
                    value={oppfolgingsperiodeId}
                >
                    {[...oppfolgingsperioder]
                        .sort((a, b) => Date.parse(b.start) - Date.parse(a.start))
                        .map((periode) => (
                            <option
                                key={`oppfolgingsperiodeoption-${periode.id}`}
                                value={periode.id}
                            >
                                {periode.slutt == undefined
                                    ? 'Nåværende periode'
                                    : formaterDatoKortManed(periode.start) +
                                      ' - ' +
                                      formaterDatoKortManed(periode.slutt)}
                            </option>
                        ))}
                </Select>
                <div>
                    <Label>Sist journalført</Label>
                    <BodyShort>{sistJournalførtTekst()}</BodyShort>
                </div>
                <Button loading={journalfører} variant="primary" onClick={() => sendTilArkiv()}>
                    Journalfør
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
