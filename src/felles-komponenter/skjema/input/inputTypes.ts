import * as React from 'react';

export interface FieldStateInput {
    id: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler;
    onBlur: React.FocusEventHandler;
}
