import { Document, Page } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import {  GlobalWorkerOptions } from "pdfjs-dist";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Loader } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import { selectForhaandsvisningStatus, selectJournalføringstatus } from '../verktoylinje/arkivering/arkiv-slice';

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

interface PdfProps {
    pdf: string | undefined;
}

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

export const PdfViewer = ({ pdf }: PdfProps) => {
    const forhaandsvisningStatus = useSelector(selectForhaandsvisningStatus);
    const journalførtStatus = useSelector(selectJournalføringstatus);
    const henterForhaandsvisning = [Status.PENDING, Status.RELOADING].includes(forhaandsvisningStatus);
    const [numPages, setNumPages] = useState(0);
    const [visAlert, setVisAlert] = useState(true);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
            setNumPages(nextNumPages);
        },
        [pdf],
    );

    const blob = useMemo(() => {
        if (!pdf) return undefined;
        return createBlob(pdf);
    }, [pdf]);

    useEffect(() => {
        setVisAlert(true)
        const timeoutId = setTimeout(() => {
            setVisAlert(false);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [journalførtStatus, forhaandsvisningStatus]);

    const containerWidth = 800;
    const maxWidth = 800;

    return (
        <div className="mt-4 container pt-4 pb-4 relative z-0 flex justify-center">
            {visAlert && journalførtStatus === Status.OK && forhaandsvisningStatus == Status.OK && (
                <Alert variant="success" role="alert" className="fixed z-10 mt-10">
                    Aktivitetsplanen ble journalført.
                </Alert>
            )}
            {!blob || henterForhaandsvisning ? (
                <div className="min-h-[calc(100vh-180px)] flex justify-center">
                    <Loader size="3xlarge" title="Venter..." className="mt-32 self-center" />
                </div>
            ) : (
                <Document
                    className="space-y-4 min-h-[calc(100vh-180px)] z-0"
                    onLoadSuccess={onDocumentLoadSuccess}
                    file={blob}
                    loading={
                        <div>
                            Vi lager en PDF<br />
                            Noen ganger trenger vi litt tid til dette dessverre
                        </div>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        />
                    ))}
                </Document>
            )}
        </div>
    );
};
