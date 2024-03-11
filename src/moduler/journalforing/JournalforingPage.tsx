import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React from 'react';
import { selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { useSelector } from 'react-redux';
import { PdfViewer } from './PdfViewer';
import Sidebar from './Sidebar';

export const JournalforingPage = () => {
    const arkivStatus = useSelector(selectArkivStatus);
    const pdf = useSelector(selectPdf);

    return (
        <section className="flex flex-row py-8">
            <Sidebar />

            {pdf && (
                <Innholdslaster avhengigheter={[arkivStatus]}>
                    <div className="w-full h-full grow bg-gray-300 overflow-y-scroll max-h-100vh pb-4">
                        {<PdfViewer pdf={pdf} />}
                    </div>
                </Innholdslaster>
            )}
        </section>
    );
};
