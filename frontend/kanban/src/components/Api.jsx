// src/components/Api.jsx
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function API() {
    const [columns, setColumns] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        // charge colonnes + cartes une seule fois
        (async () => {
            try {
                const [colsRes, cardsRes] = await Promise.all([
                    fetch(`${API_BASE}/column`),
                    fetch(`${API_BASE}/card`)
                ]);
                const cols = await colsRes.json();
                const crds = await cardsRes.json();
                setColumns(Array.isArray(cols) ? cols : []);
                setCards(Array.isArray(crds) ? crds : []);
            } catch (err) {
                console.error("Erreur fetch initial:", err);
            }
        })();
    }, []);

    const createColumn = async (name) => {
        // colonne sans nom ou avec espace
        if (!name || !name.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/column`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            if (!res.ok) {
                const txt = await res.text();
                console.error("createColumn backend error:", txt);
                return;
            }
            const newCol = await res.json();
            // Assure que la réponse contient id et name côté backend
            setColumns(prev => [...prev, newCol]);
            return newCol;
        } catch (err) {
            console.error("createColumn network error:", err);
        }
    };

    const updateColumn = async (id, name) => {
        if (!id || !name) return;
        try {
            const res = await fetch(`${API_BASE}/column/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            if (!res.ok) {
                console.error("updateColumn backend error");
                return;
            }
            const updated = await res.json();
            setColumns(prev => prev.map(c => c.id === id ? { ...c, name: updated.name || name } : c));
            return updated;
        } catch (err) {
            console.error("updateColumn network error:", err);
        }
    };

    const deleteColumn = async (id) => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/column/${id}`, { method: "DELETE" });
            if (!res.ok) {
                console.error("deleteColumn backend error");
                return;
            }
            // ne supprimer que la colonne ciblée
            setColumns(prev => prev.filter(c => c.id !== id));
            // supprimer les cartes liées
            setCards(prev => prev.filter(card => card.columnId !== id));
        } catch (err) {
            console.error("deleteColumn network error:", err);
        }
    };

    const createCard = async (columnId, cardData) => {
        if (!columnId || !cardData || !cardData.name) return;
        try {
            const res = await fetch(`${API_BASE}/card`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...cardData, column_id: columnId })
            });
            if (!res.ok) {
                const txt = await res.text();
                console.error("createCard backend error:", txt);
                return;
            }
            const newCard = await res.json();
            const cardWithColumnId = { ...newCard, columnId: newCard.column_id };
            setCards(prev => [...prev, cardWithColumnId]);
            return cardWithColumnId;
        } catch (err) {
            console.error("createCard network error:", err);
        }
    };

    const updateCard = async (id, data) => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/card/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                console.error("updateCard backend error");
                return;
            }
            const updated = await res.json();
            const updatedCard = { ...updated, columnId: updated.column_id };
            setCards(prev =>
                prev.map(c => (c.id === id ? { ...c, ...updatedCard } : c))
            );
            return updatedCard;
        } catch (err) {
            console.error("updateCard network error:", err);
        }
    };

    const deleteCard = async (id) => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/card/${id}`, { method: "DELETE" });
            if (!res.ok) {
                console.error("deleteCard backend error");
                return;
            }
            setCards(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("deleteCard network error:", err);
        }
    };

    return {
        columns,
        cards,
        createColumn,
        updateColumn,
        deleteColumn,
        createCard,
        updateCard,
        deleteCard
    };
}
