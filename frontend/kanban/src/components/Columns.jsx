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
        setLocalCards(cards);
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

        //  mise à jour locale
        setLocalCards(prev =>
            prev.map(card =>
                card.id === movedCardId ? { ...card, column_id: toColumnId } : card
            )
        );

        //  mise à jour backend
        await updateCard(movedCardId, { column_id: toColumnId });
    };



    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
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
                            cards={localCards}
                            updateColumn={updateColumn}
                            deleteColumn={deleteColumn}
                            createCard={createCard}
                            updateCard={updateCard}
                            deleteCard={deleteCard} />
                    ))}
                </div >
            </DragDropContext>
        </>
    )
}

export default Columns