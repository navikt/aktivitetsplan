import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filter/filter';

function Verktoylinje({ viserHistoriskPeriode }) {
    return (
        <div className="verktoylinje">
            <div className="verktoylinje__verktoy">
                <Lenkeknapp
                    type="hoved"
                    href="/aktivitet/ny"
                    disabled={viserHistoriskPeriode}
                >
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
            </div>
            <div className="verktoylinje__verktoy">
                <Filter />
            </div>
        </div>
    );
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const historiskPeriode = state.data.filter.historiskPeriode;
    return {
        viserHistoriskPeriode: !!historiskPeriode,
    };
};

export default connect(mapStateToProps)(Verktoylinje);
