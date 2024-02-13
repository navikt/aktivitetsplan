import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React, { useState } from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { Button } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const createBlob = (pdf: string) => {
    const bytes = atob(pdf);
    let length = bytes.length;
    const out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    const blob = new Blob([out], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
};

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(useSelector(selectArkivStatus));
    const pdf = useSelector(selectPdf);

    const [numPages, setNumPages] = useState(0);
    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };

    const containerWidth = 600;
    const maxWidth = 600;

    return (
        <section className="grow flex flex-col justify-center items-center p-8">
            <div className="w-full flex flex-col justify-center items-center">
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
                        <div className="mt-4 border h-80 w-full">
                            <Document onLoadSuccess={onDocumentLoadSuccess} file={createBlob(pdf)}>
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                                    />
                                ))}
                            </Document>
                        </div>
                    )}
                </Innholdslaster>
            </div>
        </section>
    );
};
