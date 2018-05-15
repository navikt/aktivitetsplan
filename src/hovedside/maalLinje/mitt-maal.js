import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';

import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

const MalHeaderLenke = ({ harMaal }) => {
    const url = harMaal ? '/mal' : '/mal/endre';

    return (
        <Lenke href={url} className="maalheader__lenke">
            <Element className="maalheader__element" tag="span">
                <FormattedMessage id={'aktivitetsmal.mitt-mal'} />
            </Element>
        </Lenke>
    );
};

const Mal = ({ mal }) => {
    if (!mal) {
        return (
            <div>
                <FormattedMessage id={'aktivitetsmal.mitt-mal-deafult'} />
            </div>
        );
    }
    return (
        <i>
            <Tekstomrade>
                {`"${mal}"`}
            </Tekstomrade>
        </i>
    );
};

class MittMaal extends Component {
    componentDidMount() {
        this.props.doHentMal();
    }

    render() {
        const { avhengigheter, mal } = this.props;

        return (
            <div className="mitt-maal">
                <div>
                    <MalHeaderLenke harMaal={!!mal} />
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <div className="maal_text">
                            <Mal mal={mal} />
                        </div>
                    </Innholdslaster>
                </div>
            </div>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
};

Mal.propTypes = {
    mal: PT.string,
};

MittMaal.defaultProps = {
    mal: undefined,
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
};

MalHeaderLenke.propTypes = {
    harMaal: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MittMaal);
