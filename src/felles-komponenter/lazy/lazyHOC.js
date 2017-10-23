import React from 'react';

export default function lazyHOC(WrappingComponent) {
    function lazy(props) {
        return <WrappingComponent {...props} />;
    }
    return lazy;
}
