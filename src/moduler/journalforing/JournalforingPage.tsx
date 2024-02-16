import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React, { useState } from 'react';
import {
    hentPdfTilForhaandsvisning,
    arkiver,
    selectArkivStatus,
    selectPdf,
    selectForhaandsvisningOpprettet,
} from '../verktoylinje/arkivering/arkivering-slice';
import { Button } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { PdfViewer } from './PdfViewer';

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(useSelector(selectArkivStatus));
    const pdf = useSelector(selectPdf);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);

    const sendTilArkiv = () => {
        if (forhaandsvisningOpprettet) {
            dispatch(arkiver({ oppfolgingsperiodeId: vistOppfolgingsperiode!!.uuid, forhaandsvisningOpprettet }));
        }
    };

    return (
        <section className="grow flex flex-col justify-center items-center p-8  h-full sticky">
            <div className="w-full flex flex-col justify-center items-center bg-gray-400">
                <Innholdslaster avhengigheter={[]}>
                    <div className="px-12 print:border-none space-x-4 bg-white flex pb-4 self-stretch">
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
                    {pdf && <PdfViewer pdf={pdf} />}
                </Innholdslaster>
            </div>
        </section>
    );
};
