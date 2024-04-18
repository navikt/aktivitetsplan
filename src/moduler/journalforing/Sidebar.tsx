import React, { FunctionComponent } from 'react';
import { BodyShort, Button, Heading, Label, Select } from '@navikt/ds-react';
import { Link as ReactRouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    hentPdfTilForhaandsvisning,
    journalfør,
    selectForhaandsvisningOpprettet,
    selectForhaandsvisningStatus,
    selectSistJournalfort,
} from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routing/useRoutes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { formaterDatoKortManed, formaterTid } from '../../utils/dateUtils';
import { useFnrOgEnhetContext } from '../../Provider';

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const { oppfolgingsperiodeId } = useParams<{ oppfolgingsperiodeId: string }>();
    const oppfolgingsperioder = useSelector(selectOppfolgingsPerioder);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);
    const sistJournalfort = useSelector(selectSistJournalfort);
    const arkivStatus = useSelector(selectForhaandsvisningStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const { hovedsideRoute } = useRoutes();
    const navigate = useNavigate();
    const { aktivEnhet: journalførendeEnhet } = useFnrOgEnhetContext();

    if (!journalførendeEnhet || !oppfolgingsperiodeId) {
        throw new Error('Kan ikke arkivere når aktiv enhet ikke er valgt');
    }

    const sendTilArkiv = () => {
        if (forhaandsvisningOpprettet) {
            dispatch(journalfør({ forhaandsvisningOpprettet, journalførendeEnhet, oppfolgingsperiodeId }));
        }
    };

    const onEndretOppfolgingsperiode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valgtOppfølgingsperiode = e.target.value;
        navigate(`/aktivitetsplan/journalforing/${valgtOppfølgingsperiode}`, { replace: true });
        dispatch(hentPdfTilForhaandsvisning({ journalførendeEnhet, oppfolgingsperiodeId: valgtOppfølgingsperiode }));
    };

    return (
        <div className="items-start space-y-4 max-w-96 py-8 px-8 bg-white md:sticky top-0 h-screen">
            <Heading size="large">Journalføring</Heading>
            <div className="print:border-none space-y-8 flex flex-col pb-4">
                <ReactRouterLink
                    className="text-text-action underline hover:no-underline"
                    to={hovedsideRoute()}
                    tabIndex={0}
                >
                    Til aktivitetsplanen
                </ReactRouterLink>
                <BodyShort>Aktiviteter og dialogtråder tilknyttet KVP blir ikke inkludert i journalføringen.</BodyShort>
                <Select
                    label="Oppfølgingsperiode"
                    onChange={onEndretOppfolgingsperiode}
                    disabled={arkiverer || !forhaandsvisningOpprettet}
                >
                    {[...oppfolgingsperioder]
                        .sort((a, b) => Date.parse(b.startDato) - Date.parse(a.startDato))
                        .map((periode) => (
                            <option
                                key={`oppfolgingsperiodeoption-${periode.uuid}`}
                                value={periode.uuid}
                                selected={oppfolgingsperiodeId === periode.uuid}
                            >
                                {formaterDatoKortManed(periode.startDato)} - {formaterDatoKortManed(periode.sluttDato)}
                            </option>
                        ))}
                </Select>
                <div>
                    <Label>Sist journalført</Label>
                    <BodyShort>
                        {sistJournalfort
                            ? formaterDatoKortManed(sistJournalfort) + ' kl. ' + formaterTid(sistJournalfort)
                            : 'Aldri'}
                    </BodyShort>
                </div>
                <Button
                    disabled={arkiverer || !forhaandsvisningOpprettet}
                    variant="primary"
                    onClick={() => sendTilArkiv()}
                >
                    Journalfør
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
