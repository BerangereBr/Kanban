import '../styles/card.scss';
import deleteIcon from '../assets/icons/delete.png';
import deleteIconHover from '../assets/icons/deleteHover.png'
import { useState } from 'react';

function Card({ card, onDelete }) {
    const [deleteCard, setdeleteCard] = useState(false);

    return (
        <div className="card">
            <div className='card-supr'>
                <button onClick={() => onDelete(card.id)} className="card-btn-supr" onMouseOver={() => setdeleteCard(true)} onMouseLeave={() => setdeleteCard(false)}>
                    <img src={deleteCard ? deleteIconHover : deleteIcon} alt='delete' width='20px' />
                </button>
            </div>
            <h2 className='card-name'>{card.name}</h2>
            <p className='card-description'>{card.description}</p>
        </div>
    )
}

export default Card