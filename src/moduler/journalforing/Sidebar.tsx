import React, { FunctionComponent } from 'react';
import { BodyShort, Button, Heading, Label, Select } from '@navikt/ds-react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
    hentPdfTilForhaandsvisning,
    selectForhaandsvisningStatus,
    selectForhaandsvisningOpprettet,
    selectSistJournalfort,
} from '../verktoylinje/arkivering/forhaandsvisning-slice';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { formaterDatoKortManed } from '../../utils/dateUtils';
import { journalfoer, resettStatus } from '../verktoylinje/arkivering/journalfoering-slice';

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const oppfolgingsperioder = useSelector(selectOppfolgingsPerioder);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);
    const sistJournalfort = useSelector(selectSistJournalfort);
    const arkivStatus = useSelector(selectForhaandsvisningStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const { hovedsideRoute } = useRoutes();

    const sendTilArkiv = () => {
        if (forhaandsvisningOpprettet) {
            dispatch(journalfoer({ oppfolgingsperiodeId: vistOppfolgingsperiode!!.uuid, forhaandsvisningOpprettet }));
        }
    };

    const onEndretOppfolgingsperiode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(resettStatus());
        dispatch(hentPdfTilForhaandsvisning(e.target.value));
    };

    return (
        <div className="items-start space-y-4 max-w-96 py-8 px-8 bg-white sticky top-0 h-screen">
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
                        .map((periode, index) => (
                            <option
                                key={`oppfolgingsperiodeoption-${index}`}
                                value={periode.uuid}
                                selected={vistOppfolgingsperiode!!.uuid === periode.uuid}
                            >
                                {formaterDatoKortManed(periode.startDato)} - {formaterDatoKortManed(periode.sluttDato)}
                            </option>
                        ))}
                </Select>
                <BodyShort>
                    <Label>Sist journalført</Label>
                    {sistJournalfort ? sistJournalfort : 'Aldri'}
                </BodyShort>
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
