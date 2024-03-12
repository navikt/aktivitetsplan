import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import React, { useState } from 'react';
import { Loader } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import { selectArkivStatus } from '../verktoylinje/arkivering/arkivering-slice';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfProps {
    pdf: string;
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
    const arkivStatus = useSelector(selectArkivStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const [numPages, setNumPages] = useState(0);
    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };

    const containerWidth = 800;
    const maxWidth = 800;

    return (
        <div className="mt-4 container pt-4 pb-4">
            {arkiverer ? (
                <Loader size="3xlarge" title="Venter..." variant="interaction" className="mt-32 self-center" />
            ) : (
                <Document className="space-y-4" onLoadSuccess={onDocumentLoadSuccess} file={createBlob(pdf)}>
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
