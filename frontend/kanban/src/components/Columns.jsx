import { useEffect, useState } from "react"
import Card from "./Card";

function Column() {
    const [columns, setColumns] = useState([]);
    const [cards, setCards] = useState([]);
    const [newColumn, setNewColumn] = useState('');
    const [newCard, setNewCard] = useState({});

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
    };

    const createCard = async (columnId) => {
        if (!newCard[columnId]) return;
        const res = await fetch('http://localhost:4000/api/card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCard[columnId], description: '', column_id: columnId })
        })
        const card = await res.json();
        setCards(prev => [...prev, card]);
        setNewCard(prev => ({ ...prev, [columnId]: '' }))
    }

    const updateColumn = async (id) => {
        const newName = prompt('Nouveau nom :');
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
            <input value={newColumn} onChange={e => setNewColumn(e.target.value)} ></input>
            <button onClick={createColumn}>Ajouter</button>
            {columns.map(column => (
                <div key={column.id}>
                    <h2>{column.name}</h2>
                    <button onClick={() => updateColumn(column.id)}>modifier</button>
                    <button onClick={() => deleteColumn(column.id)}>supprimer</button>
                    <input
                        value={newCard[column.id] || ''}
                        onChange={e => setNewCard(prev => ({ ...prev, [column.id]: e.target.value }))}
                        placeholder="Nouvelle carte"
                    />
                    <button onClick={() => createCard(column.id)}>Ajouter une carte</button>


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
            ))}
        </>
    )
}

export default Column