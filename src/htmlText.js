import { FormattedHTMLMessage } from 'react-intl';
import PT from 'prop-types';
import React from 'react';

export default function HtmlText(props) {
    const { id, className, ...restValues } = props;
    return (
        <FormattedHTMLMessage id={id} values={restValues}>
            {content =>
                <div
                    className={className}
                    dangerouslySetInnerHTML={{ __html: content }} // eslint-disable-line react/no-danger
                />}
        </FormattedHTMLMessage>
    );
}

HtmlText.propTypes = {
    id: PT.string.isRequired,
    className: PT.string,
};

HtmlText.defaultProps = {
    className: undefined,
};
