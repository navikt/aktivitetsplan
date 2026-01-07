import { ArrowCirclepathIcon, EnvelopeOpenIcon, PrinterSmallIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, Heading } from '@navikt/ds-react';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';
import Filter from '../filtrering/Filter';
import VisValgtFilter from '../filtrering/VisValgtFilter';
import { logKlikkKnapp } from '../../analytics/analytics';
import { useSelector } from 'react-redux';
import { selectSendTilBrukerStatus } from '../verktoylinje/arkivering/arkiv-slice';
import { Status } from '../../createGenericSlice';
import { selectAktiviterForAktuellePerioden } from '../aktivitet/aktivitetlisteSelector';

interface Props {
    tilbakeRoute?: string;
    kanSkriveUt: boolean;
    oppdaterForhaandsvistPdf: () => void;
    skrivUt: () => void;
    sendTilBruker: () => void;
    kanSendeTilBruker: boolean;
    pdfMåOppdateresEtterFilterendring: boolean;
    inkluderDialoger: boolean;
    setInkluderDialoger: (inkluderDialoger: boolean) => void;
}

function PrintVerktoylinje({
                               tilbakeRoute,
                               kanSkriveUt,
                               oppdaterForhaandsvistPdf,
                               skrivUt,
                               kanSendeTilBruker,
                               sendTilBruker,
                               pdfMåOppdateresEtterFilterendring,
                               inkluderDialoger,
                               setInkluderDialoger
                           }: Props) {
    const sendTilBrukerStatus = useSelector(selectSendTilBrukerStatus);
    const senderTilBruker = [Status.PENDING, Status.RELOADING].includes(sendTilBrukerStatus);

    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const harAktivitet = aktiviteter.length > 1;

    return (
        <>
            <Heading className="print:hidden" spacing size={'large'}>
                Skriv ut aktivitetsplanen
            </Heading>
            <div className="print:hidden self-start flex flex-row mb-8 items-center gap-x-10">
                {tilbakeRoute ? (
                    <ReactRouterLink
                        className="text-text-action underline hover:no-underline"
                        to={tilbakeRoute}
                        tabIndex={0}
                    >
                        Tilbake
                    </ReactRouterLink>
                ) : null}
                {harAktivitet &&
                    <div className="self-start flex flex-row gap-4 items-center">
                        <Filter /><Button icon={<ArrowCirclepathIcon />} onClick={oppdaterForhaandsvistPdf}>Oppdater
                        visning</Button>
                    </div>}
                <div className="self-start flex flex-row items-center gap-4">
                    {kanSkriveUt ? (
                        <Button
                            icon={<PrinterSmallIcon />}
                            onClick={() => {
                                skrivUt();
                                loggEvent(TRYK_PRINT);
                                logKlikkKnapp('Skriv ut');
                            }}
                            disabled={pdfMåOppdateresEtterFilterendring}
                        >
                            Skriv ut
                        </Button>
                    ) : null}
                    {kanSendeTilBruker &&
                        <Button icon={<EnvelopeOpenIcon />} onClick={() => {
                            sendTilBruker();
                            logKlikkKnapp('Journalfør og send til bruker');
                        }} loading={senderTilBruker} disabled={pdfMåOppdateresEtterFilterendring}>Journalfør og send til
                            bruker</Button>}
                </div>
            </div>
            <div>
                <Checkbox checked={inkluderDialoger} onClick={() => setInkluderDialoger(!inkluderDialoger)} >
                    Inkluder dialoger
                </Checkbox>
            </div>
            <div className="print:hidden mb-8">
                <VisValgtFilter />
            </div>
        </>
    );
}

export default PrintVerktoylinje;
