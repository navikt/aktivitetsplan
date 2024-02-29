import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React from 'react';
import {
    hentPdfTilForhaandsvisning,
    arkiver,
    selectArkivStatus,
    selectPdf,
    selectForhaandsvisningOpprettet,
} from '../verktoylinje/arkivering/arkivering-slice';
import { Button, Heading } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { PdfViewer } from './PdfViewer';
import { useRoutes } from '../../routes';
import { Link as ReactRouterLink } from 'react-router-dom';

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkivStatus = useSelector(selectArkivStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const pdf = useSelector(selectPdf);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);
    const { hovedsideRoute } = useRoutes();

    const sendTilArkiv = () => {
        if (forhaandsvisningOpprettet) {
            dispatch(arkiver({ oppfolgingsperiodeId: vistOppfolgingsperiode!!.uuid, forhaandsvisningOpprettet }));
        }
    };

    return (
        <section className="grow flex flex-col justify-center items-center py-8 h-full sticky">
            <div className="flex flex-col justify-center items-start container space-y-4">
                <Heading size="large">Journalføring</Heading>
                <div className=" print:border-none space-x-8 flex items-center pb-4 self-stretch">
                    <ReactRouterLink
                        className="text-text-action underline hover:no-underline"
                        to={hovedsideRoute()}
                        tabIndex={0}
                    >
                        Til aktivitetsplanen
                    </ReactRouterLink>
                    <Button
                        disabled={arkiverer || !forhaandsvisningOpprettet}
                        variant="secondary"
                        onClick={() => sendTilArkiv()}
                    >
                        Journalfør
                    </Button>
                    <Button
                        disabled={arkiverer}
                        variant="secondary"
                        onClick={() => dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid))}
                    >
                        Forhåndsvisning
                    </Button>
                </div>
            </div>

            {pdf && (
                <Innholdslaster avhengigheter={[arkivStatus]}>
                    <div className="w-full h-full grow bg-gray-300 overflow-y-scroll max-h-100vh pb-4">
                        {<PdfViewer pdf={pdf} />}
                    </div>
                </Innholdslaster>
            )}
        </section>
    );
};
