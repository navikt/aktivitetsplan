import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

function Textarea(props) {
    const cls = (className) => classNames(className);

    // let tekstomrade = null;
    // let antall = null;
    // const tell = () => { antall = tekstomrade.value.length; };
    //                 ref={(textarea) => { tekstomrade = textarea; }}
    //                 onKeyUp={tell}
    return (
        <div>
            <div className="skjema__input">
                <label className="skjema__label" htmlFor={props.id}>
                    {props.label}
                </label>
                <textarea
                    className={cls(props.className)}
                    type="text"
                    id={props.id}
                    style={{ maxWidth: '100%' }}
                    maxLength={props.maxLength}
                />
                {/* <span>{props.maxLength - antall}</span>*/}
            </div>
        </div>
    );
}

Textarea.defaultProps = {
    maxLength: 255
};

Textarea.propTypes = {
    id: PT.string.isRequired,
    label: PT.node.isRequired,
    maxLength: PT.number,
    className: PT.string
};

export default Textarea;
