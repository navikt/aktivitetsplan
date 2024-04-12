import React, { useEffect } from 'react';
import {
    hentPdfTilForhaandsvisning,
    selectPdf,
    settOppfølgingsperiodeIdForArkivering,
} from '../verktoylinje/arkivering/arkiv-slice';
import { useSelector } from 'react-redux';
import { PdfViewer } from './PdfViewer';
import Sidebar from './Sidebar';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useAktivEnhet } from '../../Provider';

export const JournalforingPage = () => {
    const pdf = useSelector(selectPdf);
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const dispatch = useAppDispatch();
    const journalførendeEnhet = useAktivEnhet();

    if (!journalførendeEnhet) {
        throw new Error('Kan ikke arkivere når aktiv enhet ikke er valgt');
    }

    useEffect(() => {
        if (vistOppfolgingsperiode) {
            dispatch(settOppfølgingsperiodeIdForArkivering(vistOppfolgingsperiode.uuid));
            dispatch(hentPdfTilForhaandsvisning({ journalførendeEnhet }));
        }
    }, []);

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
