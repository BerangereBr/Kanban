import { useState } from "react";
import Card from "./Card";
import Modal from "./Modal";

function Column({ column, cards, updateColumn, deleteColumn, createCard, deleteCard }) {
    const [modalEdit, setModalEdit] = useState(false);
    const [modalNewCard, setModalNewCard] = useState(false);
    const [newName, setNewName] = useState(column.name);
    const [newCard, setNewCard] = useState({ name: "", description: "" });

    const handleEdit = (e) => {
        e.preventDefault();
        updateColumn(column.id, newName);
        setModalEdit(false);
    };

    const handleCreateCard = (e) => {
        e.preventDefault();
        createCard(column.id, newCard);
        setNewCard({ name: "", description: "" });
        setModalNewCard(false);
    };

    return (
        <div className="column">
            <h2>{column.name}</h2>

            <button onClick={() => setModalEdit(true)} className="btn btn-column">modifier</button>
            <button onClick={() => deleteColumn(column.id)} className="btn btn-column">supprimer</button>
            <button onClick={() => setModalNewCard(true)} className="btn btn-card">Ajouter une tâche</button>

            {modalEdit && (
                <Modal onClose={() => setModalEdit(false)}>
                    <form onSubmit={handleEdit}>
                        <h3>Modifier le nom</h3>
                        <input value={newName} onChange={e => setNewName(e.target.value)} />
                        <button className="btn btn-column">valider</button>
                    </form>
                </Modal>
            )}

            {modalNewCard && (
                <Modal onClose={() => setModalNewCard(false)}>
                    <form onSubmit={handleCreateCard}>
                        <input
                            value={newCard.name}
                            onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                            placeholder="Nouvelle tâche"
                        />
                        <input
                            value={newCard.description}
                            onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                            placeholder="Description"
                        />
                        <button className="btn btn-card">Ajouter</button>
                    </form>
                </Modal>
            )}

            <div className="cards">
                {cards.map(card => (
                    <Card key={card.id} card={card} onDelete={deleteCard} />
                ))}
            </div>
        </div>
    );
}

export default Column;
