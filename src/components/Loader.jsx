import loaderImg from '../assets/loader.svg';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader">
            <h2>Cargando...</h2>
            <img src={loaderImg} alt="Cargando..." />
        </div>
    );
};

export default Loader;
