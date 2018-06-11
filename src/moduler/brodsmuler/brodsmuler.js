import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import personSvg from './person.svg';
import { selectUnderOppfolging } from '../oppfolging-status/oppfolging-selector';

const DITTNAVN_PATH = '/dittnav/';
const VEIENTILARBEID_PATH = '/veientilarbeid/';

function Brodsmuler(props) {
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
                {props.underOppfolging &&
                    <li className="brodsmuler__item typo-normal">
                        <a href={VEIENTILARBEID_PATH} className="lenke">
                            Veien til arbeid
                        </a>
                    </li>}
                <li className="brodsmuler__item typo-normal">Aktivitetsplan</li>
            </ol>
        </div>
    );
}

Brodsmuler.propTypes = {
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectUnderOppfolging(state),
});

export default connect(mapStateToProps)(Brodsmuler);
