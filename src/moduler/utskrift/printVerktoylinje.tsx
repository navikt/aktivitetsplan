import { EnvelopeOpenIcon, PrinterSmallIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';
import Filter from '../filtrering/Filter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { logKlikkKnapp } from '../../analytics/analytics';
import { useSelector } from 'react-redux';
import { selectSendTilBrukerStatus } from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';

interface Props {
    tilbakeRoute?: string;
    kanSkriveUt: boolean;
    oppdaterForhaandsvistPdf: () => void;
    skrivUt: () => void;
    sendTilBruker: () => void;
    kanSendeTilBruker: boolean;
}

function PrintVerktoylinje({tilbakeRoute, kanSkriveUt, oppdaterForhaandsvistPdf, skrivUt, kanSendeTilBruker, sendTilBruker}: Props ) {
    const sendTilBrukerStatus = useSelector(selectSendTilBrukerStatus);
    const senderTilBruker = [Status.PENDING, Status.RELOADING].includes(sendTilBrukerStatus);

    return (
        <>
            <Heading className="print:hidden" spacing size={'large'}>
                Skriv ut aktivitetsplanen
            </Heading>
            <div className="print:hidden self-start flex flex-row gap-x-10 mb-8 items-center">
                {tilbakeRoute ? (
                    <ReactRouterLink
                        className="text-text-action underline hover:no-underline"
                        to={tilbakeRoute}
                        tabIndex={0}
                    >
                        Tilbake
                    </ReactRouterLink>
                ) : null}
                {kanSkriveUt ? (
                    <Button
                        icon={<PrinterSmallIcon />}
                        onClick={() => {
                            skrivUt()
                            loggEvent(TRYK_PRINT);
                            logKlikkKnapp('Skriv ut');
                        }}
                    >
                        Skriv ut
                    </Button>
                ) : null}
                <Filter />
                <Button onClick={oppdaterForhaandsvistPdf}>Oppdater visning</Button>
                { kanSendeTilBruker && <Button icon={<EnvelopeOpenIcon/>} onClick={sendTilBruker} loading={senderTilBruker}>Journalfør og send til bruker</Button>}
            </div>
            <div className="print:hidden mb-8">
                <VisValgtFilter />
            </div>
        </>
    );
}

export default PrintVerktoylinje;
