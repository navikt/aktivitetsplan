import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import personSvg from './person.svg';
import { selectUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import Brodsmule from './brodsmule';

const DITTNAVN_PATH = '/dittnav/';
const VEIENTILARBEID_PATH = '/veientilarbeid/';

function Brodsmuler(props) {
    if (props.underOppfolging === undefined) {
        return null;
    }
    return (
        <div className="brodsmuler">
            <img
                src={personSvg}
                alt="person-illustrasjon"
                className="brodsmuler__illustrasjon"
            />
            <ol className="brodsmuler__list">
                <Brodsmule tekst="Ditt NAV" path={DITTNAVN_PATH} />
                <Brodsmule
                    tekst="Veien til arbeid"
                    path={VEIENTILARBEID_PATH}
                    skalVises={props.underOppfolging}
                />
                <Brodsmule tekst="Aktivitetsplan" />
            </ol>
        </div>
    );
}

Brodsmuler.propTypes = {
    underOppfolging: PT.bool,
};

Brodsmuler.defaultProps = {
    underOppfolging: undefined,
};

const mapStateToProps = state => ({
    underOppfolging: selectUnderOppfolging(state),
});

export default connect(mapStateToProps)(Brodsmuler);
