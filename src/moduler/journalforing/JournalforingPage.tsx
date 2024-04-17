import React, { useEffect } from 'react';
import { hentPdfTilForhaandsvisning, selectPdf } from '../verktoylinje/arkivering/arkiv-slice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useFnrOgEnhetContext } from '../../Provider';
import { LoaderFunctionArgs, Params, useParams } from 'react-router-dom';
import { Dispatch } from '../../store';
import Sidebar from './Sidebar';
import { PdfViewer } from './PdfViewer';
import { hentMal } from '../mal/aktivitetsmal-slice';
import { hentMalListe } from '../mal/malliste-slice';

export const JournalforingPage = () => {
    const pdf = useSelector(selectPdf);
    const { oppfolgingsperiodeId } = useParams<{ oppfolgingsperiodeId: string }>();
    const dispatch = useAppDispatch();
    const { aktivEnhet: journalførendeEnhet } = useFnrOgEnhetContext();

    if (!journalførendeEnhet) {
        throw new Error('Kan ikke arkivere når aktiv enhet ikke er valgt');
    }

    return (
        <div className="flex flex-col grow">
            <section className="flex md:flex-row flex-col relative">
                <Sidebar />
                <div className="h-full grow bg-bg-subtle max-h-100vh overflow-x-scroll overflow-y-hidden pb-4">
                    <PdfViewer pdf={pdf} />
                </div>
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
        if (!oppfolgingsperiodeId) return 'Dett var dumt';
        return dispatch(
            hentPdfTilForhaandsvisning({
                journalførendeEnhet: aktivEnhet,
                oppfølgingsperiodeId: oppfolgingsperiodeId,
            }),
        );
    };
