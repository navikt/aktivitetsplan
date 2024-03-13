import React, { useEffect } from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { useSelector } from 'react-redux';
import { PdfViewer } from './PdfViewer';
import Sidebar from './Sidebar';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';

export const JournalforingPage = () => {
    const arkivStatus = useSelector(selectArkivStatus);
    const pdf = useSelector(selectPdf);
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid));
        console.log('arkivstatus: ', arkivStatus);
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
