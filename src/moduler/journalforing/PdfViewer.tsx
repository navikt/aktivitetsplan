import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import React, { useState } from 'react';

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
    const [numPages, setNumPages] = useState(0);
    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };

    const containerWidth = 800;
    const maxWidth = 800;

    return (
        <div className="mt-4 max-h-full">
            <Document className="space-y-4 overflow" onLoadSuccess={onDocumentLoadSuccess} file={createBlob(pdf)}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                    />
                ))}
            </Document>
        </div>
    );
};
