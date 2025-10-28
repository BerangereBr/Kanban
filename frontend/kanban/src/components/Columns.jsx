import { useEffect, useState } from "react"

function Column() {
    const [columns, setColumns] = useState([]);
    const [newColumn, setNewColumn] = useState('');

    useEffect(() => {
        fetch('http://localhost:4000/api/column')
            .then(res => res.json())
            .then(data => setColumns(data))
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

    const deleteColumn = async (id) => {
        await fetch(`http://localhost:4000/api/column/${id}`, {
            method: 'DELETE'
        });
        setColumns(prev => prev.filter(c => c.id !== id));
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
                </div>
            ))}
        </>
    )
}

export default Column