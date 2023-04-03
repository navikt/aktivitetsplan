import { useDispatch } from 'react-redux';

import store from '../../store';

export type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
