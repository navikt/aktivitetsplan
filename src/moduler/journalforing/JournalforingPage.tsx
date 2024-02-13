import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { Button } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { Document, pdfjs } from 'react-pdf';

const src = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url);
pdfjs.GlobalWorkerOptions.workerSrc = src.toString();

const createBlob = (pdf: string) => {
    const blob = new Blob([atob(pdf)], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);

    // const base64WithoutPrefix = pdf.substr('data:application/pdf;base64,'.length);
    // const bytes = atob(base64WithoutPrefix);
    // let length = bytes.length;
    // const out = new Uint8Array(length);
    //
    // while (length--) {
    //     out[length] = bytes.charCodeAt(length);
    // }
    //
    // return new Blob([out], { type: 'application/pdf' });
};

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(useSelector(selectArkivStatus));
    const pdf = useSelector(selectPdf);

    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div className="aktivitetsplanprint flex justify-center items-center">
                <Innholdslaster avhengigheter={[]}>
                    <div className="px-12 print:border-none space-x-4">
                        <Button
                            disabled={arkiverer}
                            variant="secondary"
                            onClick={() => dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid))}
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
                    {pdf && (
                        <div className="border">
                            <Document file={pdf} />
                        </div>
                    )}
                </Innholdslaster>
            </div>
        </section>
    );
};
