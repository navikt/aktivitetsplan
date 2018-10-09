import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi';
import { HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import { Textarea } from 'nav-frontend-skjema';
import {
    IKKE_SEND_FORHANDSORIENTERING,
    SEND_FORHANDSORIENTERING,
    SEND_PARAGRAF_11_9,
} from './avtalt-form';
import Select from '../../../../felles-komponenter/skjema/input/select';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import hiddenIfHoc from '../../../../felles-komponenter/hidden-if/hidden-if';

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
            feltNavn="avtaltText"
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
                ).map(([key, value]) =>
                    <FormattedMessage id={key}>
                        {tekst =>
                            <option key={value} value={value}>
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

export default hiddenIfHoc(AvtaltFormBrukerUnderOppfolgning);
