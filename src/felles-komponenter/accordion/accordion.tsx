import React, { useState } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { UnmountClosed } from 'react-collapse';
import classNames from 'classnames';
import './accordion.less';

interface Props {
    children: React.ReactNode;
    className?: string;
    openText: string;
    closeText: string;
}

function Accordion(props: Props) {
    const { className, children, openText, closeText } = props;
    const [apen, setApen] = useState(false);

    const cls = classNames('accordion__link', { 'accordion__link-apen': apen });

    const ChevronLink = (
        <a
            href="/"
            className={cls}
            onClick={e => {
                e.preventDefault();
                setApen(!apen);
            }}
        >
            <span>{apen ? openText : closeText}</span>
            <NavFrontendChevron type={apen ? 'opp' : 'ned'} className={classNames('accordion__chevron')} />
        </a>
    );

    return (
        <div className={className}>
            <UnmountClosed isOpened={apen}>{children}</UnmountClosed>
            {ChevronLink}
        </div>
    );
}

export default Accordion;
