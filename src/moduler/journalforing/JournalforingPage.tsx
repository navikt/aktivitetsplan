import React from 'react';
import { hentPdfTilForhaandsvisning, selectPdf } from '../verktoylinje/arkivering/arkiv-slice';
import { useSelector } from 'react-redux';
import { defer, LoaderFunctionArgs, useNavigate } from 'react-router-dom';
import { Dispatch } from '../../store';
import Sidebar from './Sidebar';
import { PdfViewer } from './PdfViewer';
import { JournalErrorBoundry } from './JournalErrorBoundry';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';

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
        const oppfolgingsperioderTilBrukerIContext = useSelector(selectOppfolgingsPerioder);
        const oppfølgingsperiodeTilhørerBrukerIContext = oppfolgingsperioderTilBrukerIContext
            .map((periode) => periode.uuid)
            .includes(oppfolgingsperiodeId);

        if (!oppfølgingsperiodeTilhørerBrukerIContext) {
            const navigate = useNavigate();
            navigate('/aktivitetsplan');
        }

        const forhaandsvisning = dispatch(
            hentPdfTilForhaandsvisning({
                journalførendeEnhet: aktivEnhet,
                oppfolgingsperiodeId,
            }),
        );
        return defer({
            forhaandsvisning,
        });
    };
