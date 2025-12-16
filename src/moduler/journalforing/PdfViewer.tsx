import { Document, Page } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BodyShort, Loader } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

interface PdfProps {
    pdf: Blob;
    visSuksessmelding: boolean;
    suksessmelding: string;
    forhaandsvisningStatus: Status;
    blur?: boolean;
}

export const createBlob = (pdf: string) => {
    const bytes = atob(pdf);
    let length = bytes.length;
    const out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    const blob = new Blob([out], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
};

export const PdfViewer = ({ pdf, visSuksessmelding, suksessmelding, forhaandsvisningStatus, blur }: PdfProps) => {
    const henterForhaandsvisning = [Status.PENDING, Status.RELOADING].includes(forhaandsvisningStatus);
    const [numPages, setNumPages] = useState(0);
    const [visAlert, setVisAlert] = useState(true);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
            setNumPages(nextNumPages);
        },
        [pdf],
    );

    useEffect(() => {
        setVisAlert(true)
        const timeoutId = setTimeout(() => {
            setVisAlert(false);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [visSuksessmelding]);

    const containerWidth = 800;
    const maxWidth = 800;

    return (
        <div className="mt-4 container pt-4 pb-4 relative z-0 flex justify-center">
            {visAlert && visSuksessmelding && (
                <Alert variant="success" role="alert" className="fixed z-10 mt-10">
                    { suksessmelding }
                </Alert>
            )}
            {!pdf || henterForhaandsvisning ? (
                <div className="min-h-[calc(100vh-180px)] flex flex-col justify-center items-center">
                    <Loader size="3xlarge" title="Venter..." className="mt-32 mb-6" />
                    <BodyShort as="div" size="medium" className="text-subtle mb-1" spacing>
                        Vi lager en PDF
                    </BodyShort>
                    <BodyShort as="div" size="medium" className="text-subtle" spacing>
                        Noen ganger trenger vi litt tid til dette dessverre
                    </BodyShort>
                </div>
            ) : (
                <Document
                    className={`space-y-4 min-h-[calc(100vh-180px)] z-0 ${blur ? 'blur-sm' : ''}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    file={pdf}
                    loading=""
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    ))}
                </Document>
            )}
        </div>
    );
};
