import React from 'react';
import { hentPdfTilForhaandsvisning, selectPdf } from '../verktoylinje/arkivering/arkiv-slice';
import { useSelector } from 'react-redux';
import { LoaderFunctionArgs } from 'react-router-dom';
import { Dispatch } from '../../store';
import Sidebar from './Sidebar';
import { PdfViewer } from './PdfViewer';
import { JournalErrorBoundry } from './JournalErrorBoundry';

export const JournalforingPage = () => {
    const pdf = useSelector(selectPdf);
    return (
        <div className="flex flex-col grow">
            <section className="flex md:flex-row flex-col relative">
                <Sidebar />
                <JournalErrorBoundry>
                    <div className="h-full grow bg-bg-subtle max-h-100vh overflow-x-scroll overflow-y-hidden pb-4">
                        <PdfViewer pdf={pdf} />
                    </div>
                </JournalErrorBoundry>
            </section>
        </div>
    );
};

export const arkivLoader =
    (dispatch: Dispatch, aktivEnhet: string) =>
    ({
        params: { oppfolgingsperiodeId },
    }: LoaderFunctionArgs<{
        oppfolgingsperiodeId: string;
    }>) => {
        if (!oppfolgingsperiodeId) {
            throw Error('path param is not set, this should never happen');
        }
        const forhaandsvisning = dispatch(
            hentPdfTilForhaandsvisning({
                journalførendeEnhet: aktivEnhet,
                oppfolgingsperiodeId,
            }),
        );
        return Response.json({
            forhaandsvisning,
        });
    };
