import { useState } from "react";
import API from "./Api";
import Modal from "./Modal";
import Column from "./Column";
import '../styles/column.scss'

function Columns() {
    const { columns, cards, createColumn, updateColumn, deleteColumn, createCard, updateCard, deleteCard } = API();
    const [modalOpenColumn, setOpenModalColumn] = useState(false);
    const [newColumn, setNewColumn] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newColumn.trim()) return;
        createColumn(newColumn);
        setNewColumn("");
        setOpenModalColumn(false);
    };
    return (
        <>
            <button onClick={() => setOpenModalColumn(true)} className="btn-new-column">Nouvelle colonne</button>
            {modalOpenColumn && (
                <Modal onClose={() => setOpenModalColumn(false)}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input value={newColumn} onChange={e => setNewColumn(e.target.value)}></input>
                        <button className="btn btn-column">Ajouter</button>
                    </form>
                </Modal>
            )}

            <div className="container-column">
                {columns.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        cards={cards.filter(col => col.column_id === column.id)}
                        updateColumn={updateColumn}
                        deleteColumn={deleteColumn}
                        createCard={createCard}
                        updateCard={updateCard}
                        deleteCard={deleteCard}
                    />
                ))}
            </div >
        </>
    )
}

export default Columns