import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import Bilde from '../../felles-komponenter/bilde/bilde';
import * as AppPT from '../../proptypes';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import vilkarSvg from './vilkar-illustrasjon.svg';
import VisibleIfHOC from '../../hocs/visible-if';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import { formaterDatoKortManed } from '../../utils';
import { selectPrivatModusStatus } from '../privat-modus/privat-modus-selector';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';

const VisibleIfElementFormattedMessage = VisibleIfHOC(props =>
    <Element className="vilkar__metaData">
        <FormattedMessage {...props} />
    </Element>
);

VisibleIfElementFormattedMessage.propTypes = {
    visible: PT.bool.isRequired,
    id: PT.string.isRequired,
    values: PT.object.isRequired,
};

function VilkarInnhold({
    vilkar,
    erHistorisk,
    underOppfolging,
    avhengigheter,
}) {
    const formattertDato = formaterDatoKortManed(vilkar.dato);

    function hentTittelTekst() {
        if (erHistorisk) {
            return 'vilkar.modal.historisk.tittel';
        }

        return underOppfolging
            ? 'vilkar.modal.gjeldende.samarbeid-tittel'
            : 'vilkar.modal.gjeldende.privat-tittel';
    }

    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <div className="vilkar__innhold">
                <Bilde src={vilkarSvg} alt="" />
                <Innholdstittel className="vilkar__tittel">
                    <FormattedMessage
                        id={hentTittelTekst()}
                        values={{ dato: formattertDato }}
                    />
                </Innholdstittel>
                <UnsafeHtml className="vilkar__tekst">
                    {vilkar.tekst}
                </UnsafeHtml>
                <VisibleIfElementFormattedMessage
                    visible={!!vilkar.vilkarstatus && !!vilkar.dato}
                    id="vilkar.modal.gjeldende-status-dato"
                    values={{
                        status: vilkar.vilkarstatus,
                        dato: formattertDato,
                    }}
                />
            </div>
        </Innholdslaster>
    );
}

VilkarInnhold.defaultProps = {
    erHistorisk: false,
};

VilkarInnhold.propTypes = {
    vilkar: AppPT.vilkar.isRequired,
    erHistorisk: PT.bool,
    underOppfolging: PT.bool.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
};

const mapStateToProps = state => ({
    underOppfolging: selectErUnderOppfolging(state),
    avhengigheter: [selectPrivatModusStatus(state)],
});

export default hiddenIf(connect(mapStateToProps)(VilkarInnhold));
