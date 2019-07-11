import React from 'react';
import PersonIcon from './person-ikon';
import Brodsmule from './brodsmule';

const DITTNAVN_PATH = '/dittnav/';

export default function Brodsmuler() {
    return (
        <div className="brodsmuler">
            <PersonIcon />
            <ol className="brodsmuler__list">
                <Brodsmule tekst="Ditt NAV" path={DITTNAVN_PATH} />
                <Brodsmule tekst="Aktivitetsplan" />
            </ol>
        </div>
    );
}
