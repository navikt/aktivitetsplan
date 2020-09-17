import React from 'react';
import VisibleIfDiv from './visible-if-div';
import './visible-if-notifikasjon.less';

interface LenkeknappProps {
    visible: boolean;
}

export default function VisibleIfNotifikasjon(props: LenkeknappProps) {
    return (
        <VisibleIfDiv visible={props.visible} className="nyendring">
            <span className="nyendring-sirkel" />
        </VisibleIfDiv>
    );
}
