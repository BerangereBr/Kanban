import { useEffect, useState } from "react";
import API from "./Api";
import Modal from "./Modal";
import Column from "./Column";
import '../styles/column.scss';
import { DragDropContext } from "@hello-pangea/dnd";

function Columns() {
    const { columns, cards, createColumn, updateColumn, deleteColumn, createCard, updateCard, deleteCard } = API();
    const [modalOpenColumn, setOpenModalColumn] = useState(false);
    const [newColumn, setNewColumn] = useState("");

    // copie locale du state des cartes
    const [localCards, setLocalCards] = useState(cards);

    //  Synchronise quand API change 
    useEffect(() => {
        const mappedCards = cards.map(card => ({
            ...card,
            columnId: card.column_id
        }));
        setLocalCards(mappedCards);
    }, [cards]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newColumn.trim()) return;
        createColumn(newColumn);
        setNewColumn("");
        setOpenModalColumn(false);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const movedCardId = Number(draggableId);
        const toColumnId = Number(destination.droppableId);

        const res = await updateCard(movedCardId, { column_id: toColumnId });
        if (!res) return;

        // Met à jour le state local avec toute la carte renvoyée
        setLocalCards(prev =>
            prev.map(card =>
                card.id === movedCardId
                    ? { ...card, columnId: res.column_id, name: res.name, description: res.description }
                    : card
            )
        );
    };

    const handleCreateCard = async (columnId, newCard) => {
        const createdCard = await createCard(columnId, newCard);
        if (!createdCard) return;

        const cardWithColumnId = { ...createdCard, columnId: createdCard.column_id };

        setLocalCards(prev => [...prev, cardWithColumnId]);
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <button onClick={() => setOpenModalColumn(true)} className="btn-new-column">Nouvelle colonne</button>
                {modalOpenColumn && (
                    <Modal onClose={() => setOpenModalColumn(false)}>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <input value={newColumn} onChange={e => setNewColumn(e.target.value)}></input>
                            <button className="btn btn-modal">Ajouter</button>
                        </form>
                    </Modal>
                )}

                <div className="container-column">
                    {columns.map(column => (

                        <Column
                            key={column.id}
                            column={column}
                            cards={localCards}
                            updateColumn={updateColumn}
                            deleteColumn={deleteColumn}
                            createCard={handleCreateCard}
                            updateCard={updateCard}
                            deleteCard={deleteCard} />
                    ))}
                </div >
            </DragDropContext>
        </>
    )
}

export default Columns