import React from 'react';
import personSvg from './person.svg';

const DITTNAVN_PATH = '/dittnav';
const VEIENTILARBEID_PATH = '/veientilarbeid';

function Brodsmuler() {
    return (
        <div className="brodsmuler">
            <img
                src={personSvg}
                alt="person-illustrasjon"
                className="brodsmuler__illustrasjon"
            />
            <ol className="brodsmuler__list">
                <li className="brodsmuler__item typo-normal">
                    <a href={DITTNAVN_PATH} className="lenke">
                        Ditt NAV
                    </a>
                </li>
                <li className="brodsmuler__item typo-normal">
                    <a href={VEIENTILARBEID_PATH} className="lenke">
                        Veien til arbeid
                    </a>
                </li>
                <li className="brodsmuler__item typo-normal">Aktivitetsplan</li>
            </ol>
        </div>
    );
}

export default Brodsmuler;
