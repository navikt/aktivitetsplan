import React, { FunctionComponent } from 'react';
import { BodyShort, Button, Heading, Label, Select } from '@navikt/ds-react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
    hentPdfTilForhaandsvisning,
    journalfør,
    selectForhaandsvisningOpprettet,
    selectForhaandsvisningStatus,
    selectSistJournalfort,
    settOppfølgingsperiodeIdForArkivering,
} from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routing/useRoutes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { formaterDatoKortManed, formaterTid } from '../../utils/dateUtils';

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
            dispatch(journalfør({ forhaandsvisningOpprettet }));
        }
    };

    const onEndretOppfolgingsperiode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(settOppfølgingsperiodeIdForArkivering(e.target.value));
        dispatch(hentPdfTilForhaandsvisning());
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
                                selected={vistOppfolgingsperiode?.uuid === periode.uuid}
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
