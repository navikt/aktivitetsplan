import * as PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { SpanFragment } from 'nav-frontend-tekstomrade/lib/fragments';
import React from 'react';
import BobleLenke from './boble-lenke';

const uriRegex = /((?:[\w-]+:\/\/?|www(?:-\w+)?\.)[^\s()<>]+\w)/g;
const notEmpty = element => element.length > 0;

// Basert på nav-frontend-tekstomrade/src/tekstomrade.tsx, justert som midlertidig fiks på FO-2010
function tilJSX(tekstFragment, fragmentIndex, dialogId) {
    const urimatch = uriRegex.exec(tekstFragment);

    if (urimatch === null) {
        return (
            <SpanFragment key={fragmentIndex}>
                {tekstFragment}
            </SpanFragment>
        );
    }
    return (
        <BobleLenke
            key={fragmentIndex}
            href={urimatch[0]}
            dialogId={dialogId}
        />
    );
}

function leggTilJSX(tekst, dialogId) {
    return tekst
        .split(uriRegex)
        .filter(notEmpty)
        .map((tekstFragment, index) => tilJSX(tekstFragment, index, dialogId));
}

function tilAvsnitt(avsnitt, index, list) {
    return (
        <Normaltekst
            className={index < list.length - 1 ? 'blokk-xs' : ''}
            key={index}
        >
            {avsnitt}
        </Normaltekst>
    );
}

function BobleTekstomrade({ children, dialogId }) {
    const avsnitt = children
        .split(/[\r\n]+/)
        .map(tekst => leggTilJSX(tekst, dialogId))
        .map(tilAvsnitt);

    return (
        <div>
            {avsnitt}
        </div>
    );
}

BobleTekstomrade.propTypes = {
    children: PT.string,
    dialogId: PT.string,
};

BobleTekstomrade.defaultProps = {
    children: '',
    dialogId: '',
};

export default BobleTekstomrade;
