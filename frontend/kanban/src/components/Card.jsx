import { useState } from "react"

function Card({ card, onUpdate, onDelete }) {
    const [description, setDescription] = useState(card.description);
    const handleBlur = () => {
        onUpdate(card.id, { description: description })
    }
    return (
        <>
            <h2>{card.name}</h2>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={handleBlur} ></textarea>
            <button onClick={() => onDelete(card.id)}>supprimer</button>
        </>
    )
}

export default Card