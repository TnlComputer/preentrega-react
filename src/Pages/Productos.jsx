import {useOutletContext} from 'react-router-dom';
import ItemListContainer from '../components/ItemListContainer/ItemListContainer';

function Productos() {
  const {onAgregarAlCarrito} = useOutletContext();

  return <ItemListContainer onAgregarAlCarrito={onAgregarAlCarrito} />;
}

export default Productos;
