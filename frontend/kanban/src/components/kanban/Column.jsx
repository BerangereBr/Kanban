import { useState } from "react";
import Card from "./Card";
import Modal from "./Modal";
import deleteColumnIcon from '../../assets/icons/deleteColumn.png';
import deleteColumnHover from '../../assets/icons/deleteColumnHover.png';
import modifyColumnIcon from '../../assets/icons/modifyColumn.png';
import modifyColumnHover from '../../assets/icons/modifyColumnHover.png';
import addCardIcon from '../../assets/icons/addCard.png';
import addCardHover from '../../assets/icons/addCardHover.png';
import { Droppable, Draggable } from "@hello-pangea/dnd";

function Column({ column, cards, updateColumn, deleteColumn, createCard, deleteCard }) {
    const [modalEdit, setModalEdit] = useState(false);
    const [modalNewCard, setModalNewCard] = useState(false);
    const [newName, setNewName] = useState(column.name);
    const [newCard, setNewCard] = useState({ name: "", description: "" });
    const [addCard, setAddCard] = useState(false)
    const [deleteIcon, setDeleteIcon] = useState(false);
    const [modifyIcon, setModifyIcon] = useState(false);


    const handleEdit = (e) => {
        e.preventDefault();
        updateColumn(column.id, newName);
        setModalEdit(false);
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        createCard(column.id, newCard);
        setNewCard({ name: "", description: "" });
        setModalNewCard(false);
    };

    const columnCards = cards
        .filter(c => Number(c.columnId) === Number(column.id));

    return (
        <div className="column">
            <div className="column-btn-container">
                <button onClick={() => deleteColumn(column.id)} onMouseOver={() => setDeleteIcon(true)} onMouseLeave={() => setDeleteIcon(false)} className="btn btn-column">
                    <img src={deleteIcon ? deleteColumnHover : deleteColumnIcon} alt="suprrimer" /></button>
                <button onClick={() => setModalEdit(true)} onMouseOver={() => setModifyIcon(true)} onMouseLeave={() => setModifyIcon(false)} className="btn btn-column">
                    <img src={modifyIcon ? modifyColumnHover : modifyColumnIcon} alt="suprrimer" /></button>
            </div>
            <div className="column-btn-name">
                <h2>{column.name}</h2>
                <button onClick={() => setModalNewCard(true)} onMouseOver={() => setAddCard(true)} onMouseLeave={() => setAddCard(false)} className="btn btn-card"><img src={addCard ? addCardHover : addCardIcon} alt='ajouter une carte' /></button>

            </div>
            {modalEdit && (
                <Modal onClose={() => setModalEdit(false)}>
                    <form onSubmit={handleEdit}>
                        <h3>Modifier le nom</h3>
                        <input value={newName} onChange={e => setNewName(e.target.value)} />
                        <button className="btn btn-modal">valider</button>
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
                        <button className="btn btn-modal">Ajouter</button>
                    </form>
                </Modal>
            )}

            <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="cards">
                        {columnCards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card card={card} onDelete={deleteCard} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
export default Column;
