import React from 'react';
import PT from 'prop-types'
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenke from './../../felles-komponenter/utils/lenke';
import * as AppPT from '../../proptypes';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { formaterDato } from '../../utils';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';

const dndSpec = {

    beginDrag({ aktivitet }) {
        return aktivitet;
    }

};

function collect(connector, monitor) {
    return {
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function AktivitetsKort({ aktivitet, isDragging, connectDragSource }) {
    const erFlyttbar = !aktivitet.nesteStatus && ![STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status);
    const visible = aktivitet.etikett || aktivitet.avtalt;
    const aktivitetsKort = (
        <article style={{ opacity: isDragging ? 0.4 : 1 }}>
            <Lenke
                href={`aktivitet/aktivitet/${aktivitet.id}`}
                className={classNames('aktivitetskort', erFlyttbar && 'aktivitetskort--flyttbar')}
                brukLenkestyling={false}
            >
                <div className="aktivitetskort__wrapper">
                    <div className="aktivitetskort__blokk">
                        <Undertekst tag="p" className="aktivitetskort__type">
                            <FormattedMessage id={(`aktivitetskort.type.${aktivitet.type}`).toLowerCase()} />
                        </Undertekst>
                        <Element tag="h1" className="aktivitetskort__tittel">{aktivitet.tittel}</Element>
                        <Normaltekst>
                            {
                                [formaterDato(aktivitet.fraDato), formaterDato(aktivitet.tilDato)]
                                    .filter((d) => d).join(' - ')
                            }
                        </Normaltekst>
                    </div>
                    <AktivitetskortTillegg aktivitet={aktivitet} visible={!!visible} />
                </div>
            </Lenke>
        </article>
    );

    return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired
};

export default DragSource('AktivitetsKort', dndSpec, collect)((AktivitetsKort));
