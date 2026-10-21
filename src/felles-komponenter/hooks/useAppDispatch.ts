import { useDispatch } from 'react-redux';

import { Dispatch } from '../../store/store';

const useAppDispatch: () => Dispatch = useDispatch;

export type AppDispatch = Dispatch;
export default useAppDispatch;
