import { useEffect, useState } from "react"
import Card from "./Card";
import Modal from "./Modal";
import '../styles/column.scss'

function Column() {
    const [columns, setColumns] = useState([]);
    const [cards, setCards] = useState([]);
    const [newColumn, setNewColumn] = useState('');
    const [newCard, setNewCard] = useState({});
    const [modalOpenColumn, setOpenModalColumn] = useState(false);
    const [modalOpenCard, setOpenModalCard] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/api/column')
            .then(res => res.json())
            .then(data => setColumns(data))
            .catch(err => console.log(err))
        fetch('http://localhost:4000/api/card')
            .then(res => res.json())
            .then(data => setCards(data))
            .catch(err => console.log(err))
    }, []);

    const createColumn = async () => {
        const res = await fetch('http://localhost:4000/api/column', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newColumn })
        });
        const col = await res.json();
        setColumns(prev => [...prev, col]);
        setNewColumn('');
        setOpenModalColumn(false);
    };

    const createCard = async (columnId) => {
        const cardData = newCard[columnId];
        if (!cardData?.name) return;
        const res = await fetch('http://localhost:4000/api/card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: cardData.name, description: cardData.description, column_id: columnId })
        })
        const card = await res.json();
        setCards(prev => [...prev, card]);
        setNewCard(prev => ({ ...prev, [columnId]: {} }));
        setOpenModalCard(false);
    }

    const updateColumn = async (id) => {
        const newName = prompt('nouveau nom :');
        if (!newName) return;
        const res = await fetch(`http://localhost:4000/api/column/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        const updated = await res.json();
        setColumns(prev => prev.map(c => c.id === id ? updated : c));
    }

    const updateCard = async (id, data) => {
        const res = await fetch(`http://localhost:4000/api/card/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const update = await res.json();
        setCards(prev => prev.map(c => c.id === id ? update : c))
    }

    const deleteColumn = async (id) => {
        await fetch(`http://localhost:4000/api/column/${id}`, {
            method: 'DELETE'
        });
        setColumns(prev => prev.filter(c => c.id !== id));
    }

    const deleteCard = async (id) => {
        await fetch(`http://localhost:4000/api/card/${id}`, {
            method: 'DELETE'
        });
        setCards(prev => prev.filter(c => c.id !== id));
    }
    return (
        <>
            <button onClick={() => setOpenModalColumn(true)} className="btn-new-column">Nouvelle colonne</button>
            {modalOpenColumn && (
                <Modal onClose={() => setOpenModalColumn(false)}>
                    <input value={newColumn} onChange={e => setNewColumn(e.target.value)}></input>
                    <button onClick={createColumn} className="btn btn-column">Ajouter</button>
                </Modal>
            )}
            <div className="container-column">
                {columns.map(column => (
                    <div key={column.id} className="column">
                        <h2>{column.name}</h2>
                        <button onClick={() => updateColumn(column.id)} className="btn btn-column">modifier</button>
                        <button onClick={() => deleteColumn(column.id)} className="btn btn-column">supprimer</button>
                        <button onClick={() => setOpenModalCard(column.id)} className="btn btn-card">Ajouter une tâche</button>
                        {modalOpenCard === column.id && (
                            <Modal onClose={() => setOpenModalCard(false)}>
                                <input
                                    value={newCard[column.id]?.name || ''}
                                    onChange={e => setNewCard(prev => ({ ...prev, [column.id]: { ...prev[column.id], name: e.target.value } }))}
                                    placeholder="Nouvelle tâche"
                                />
                                <input value={newCard[column.id]?.description || ''}
                                    onChange={e => setNewCard(prev => ({
                                        ...prev, [column.id]: { ...prev[column.id], description: e.target.value },
                                    }))
                                    }></input>
                                <button onClick={() => createCard(column.id)} className="btn btn-card">Ajouter une tâche </button>
                            </Modal>
                        )}
                        <div className="cards">
                            {cards.filter(c => c.column_id === column.id)
                                .map(card => (
                                    <Card
                                        key={card.id}
                                        card={card}
                                        onUpdate={updateCard}
                                        onDelete={deleteCard}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Column