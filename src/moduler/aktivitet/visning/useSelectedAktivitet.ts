import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAktivitetMedId } from '../aktivitetlisteSelector';
import { RootState } from '../../../store';

export const useSelectedAktivitet = () => {
    const { id } = useParams<{ id: string }>();
    const aktivitetId = id;
    return useSelector((state: RootState) => (aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined));
};
