
import '../styles/card.scss';

function Card({ card, onDelete }) {
    return (
        <div className="card">
            <h2>{card.name}</h2>
            <p className='description'>{card.description}</p>
            <button onClick={() => onDelete(card.id)} className="btn btn-card">supprimer</button>
        </div>
    )
}

export default Card