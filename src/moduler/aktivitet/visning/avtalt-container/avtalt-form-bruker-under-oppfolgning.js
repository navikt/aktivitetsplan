import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi';
import { HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import {
    IKKE_SEND_FORHANDSORIENTERING,
    SEND_FORHANDSORIENTERING,
    SEND_PARAGRAF_11_9,
} from './avtalt-form';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Select from '../../../../felles-komponenter/skjema/input/select';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIfHOC from '../../../../hocs/visible-if';

function AvtaltFormBrukerUnderOppfolgning({
    currentAvtaltSelect,
    forhandsorienteringMaksLengde,
}) {
    const forhandsorienteringTekstIdValuePar = {
        'sett-avtalt-send-forhandsorientering': SEND_FORHANDSORIENTERING,
        'sett-avtalt-send-paragraf-11-9': SEND_PARAGRAF_11_9,
        'sett-avtalt-ikke-send-forhandsorientering': IKKE_SEND_FORHANDSORIENTERING,
    };

    const forhadsorienteringsstekst = (
        <Normaltekst className="blokk-xs">
            <FormattedMessage id="sett-avtalt-forhandsorientering-tekst" />
        </Normaltekst>
    );

    const forhadsorienteringstekstParagraf119 = (
        <Textarea
            feltNavn="avtaltText119"
            maxLength={forhandsorienteringMaksLengde}
        />
    );

    return (
        <div>
            <Select
                labelId="sett-avtalt-velg-type"
                feltNavn="avtaltSelect"
                noBlankOption
            >
                {Object.entries(
                    forhandsorienteringTekstIdValuePar
                ).map(([tekstId, optionValue]) =>
                    <FormattedMessage id={tekstId} key={tekstId}>
                        {tekst =>
                            <option key={optionValue} value={optionValue}>
                                {tekst}
                            </option>}
                    </FormattedMessage>
                )}
            </Select>
            <VisibleIfDiv
                visible={currentAvtaltSelect !== IKKE_SEND_FORHANDSORIENTERING}
            >
                <EtikettLiten className="avtalt-tekst-etikett">
                    <FormattedMessage id="sett-avltalt-tekst-som-sendes" />
                </EtikettLiten>
                <HjelpetekstHoyre>
                    <FormattedMessage id="sett-avtalt-teskt-som-sendes-hjelpetekst" />
                </HjelpetekstHoyre>
                {currentAvtaltSelect === SEND_FORHANDSORIENTERING &&
                    forhadsorienteringsstekst}
                {currentAvtaltSelect === SEND_PARAGRAF_11_9 &&
                    forhadsorienteringstekstParagraf119}
            </VisibleIfDiv>
        </div>
    );
}

AvtaltFormBrukerUnderOppfolgning.propTypes = {
    forhandsorienteringMaksLengde: PT.number,
    currentAvtaltSelect: PT.string,
};

AvtaltFormBrukerUnderOppfolgning.defaultProps = {
    currentAvtaltSelect: SEND_FORHANDSORIENTERING,
    forhandsorienteringMaksLengde: 500,
};

export default visibleIfHOC(AvtaltFormBrukerUnderOppfolgning);
