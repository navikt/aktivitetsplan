import { useDispatch } from 'react-redux';

import { Dispatch } from '../../store';

const useAppDispatch: () => Dispatch = useDispatch;

export default useAppDispatch;
