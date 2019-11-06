import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';

export type ReduxDispatch = ThunkDispatch<any, any, Action>;
export function useReduxDispatch(): ReduxDispatch {
    return useDispatch<ReduxDispatch>();
}
