import { useState } from "react"
import '../styles/card.scss';

function Card({ card, onUpdate, onDelete }) {
    const [description, setDescription] = useState(card.description);
    const handleBlur = () => {
        onUpdate(card.id, { description: description })
    }
    return (
        <div className="card">
            <h2>{card.name}</h2>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={handleBlur} ></textarea>
            <button onClick={() => onDelete(card.id)} className="btn btn-card">supprimer</button>
        </div>
    )
}

export default Card