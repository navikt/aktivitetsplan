import React from 'react';
import PT from 'prop-types';
import Textarea from '../skjema/textarea/textarea';

export default function BegrunnelseForm({
    handleSubmit,
    labelId,
    name,
    maxLength,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <Textarea
                feltNavn="begrunnelse"
                labelId={labelId}
                name={name}
                maxLength={maxLength}
            />
        </form>
    );
}

BegrunnelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    labelId: PT.string.isRequired,
    name: PT.string.isRequired,
    maxLength: PT.number.isRequired,
};
