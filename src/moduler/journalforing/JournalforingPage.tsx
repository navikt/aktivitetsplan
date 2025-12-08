import React, { useMemo } from 'react';
import {
    hentPdfTilForhaandsvisning,
    selectForhaandsvisningStatus,
    selectJournalføringstatus,
    selectPdf
} from '../verktoylinje/arkivering/arkiv-slice';
import { useSelector } from 'react-redux';
import { defer, LoaderFunctionArgs } from 'react-router-dom';
import { Dispatch } from '../../store';
import Sidebar from './Sidebar';
import { createBlob, PdfViewer } from './PdfViewer';
import { StatusErrorBoundry } from './StatusErrorBoundry';
import { Status } from '../../createGenericSlice';

export const JournalforingPage = () => {
    const pdf = useSelector(selectPdf);
    const journalførtStatus = useSelector(selectJournalføringstatus);
    const forhaandsvisningStatus = useSelector(selectForhaandsvisningStatus);

    const blob = useMemo(() => {
        if (!pdf) return undefined;
        return createBlob(pdf);
    }, [pdf]);

    const visSuksessmelding = journalførtStatus === Status.OK && forhaandsvisningStatus == Status.OK;

    return (
        <div className="flex flex-col grow">
            <section className="flex md:flex-row flex-col relative">
                <Sidebar />
                <StatusErrorBoundry statuser={[forhaandsvisningStatus, journalførtStatus]}
                                    errorMessage="Noe gikk galt med journalføringen">
                    <div className="h-full grow bg-bg-subtle max-h-100vh overflow-x-scroll overflow-y-hidden pb-4">
                        <PdfViewer pdf={blob} visSuksessmelding={visSuksessmelding}
                                   suksessmelding={'Aktivitetsplanen ble journalført.'} />
                    </div>
                </StatusErrorBoundry>
            </section>
        </div>
    );
};

export const arkivLoader =
    (dispatch: Dispatch, aktivEnhet: string) =>
        ({
             params: { oppfolgingsperiodeId }
         }: LoaderFunctionArgs<{
            oppfolgingsperiodeId: string;
        }>) => {
            if (!oppfolgingsperiodeId) {
                throw Error('path param is not set, this should never happen');
            }
            const forhaandsvisning = dispatch(
                hentPdfTilForhaandsvisning({
                    oppfolgingsperiodeId
                })
            );
            return defer({
                forhaandsvisning
            });
        };
