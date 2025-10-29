import { db } from '../config/db.js';

export const getColumns = (req, res) => {
    db.query('SELECT * FROM columns', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

export const createColumn = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom requis' });

    db.query('INSERT INTO columns (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ id: result.insertId, name });
    });
};

export const updateColumn = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) return res.status(400).json({ error: 'Pas d’ID de colonne fourni' });
    if (!name) return res.status(400).json({ error: 'Nom de colonne manquant' });

    db.query('UPDATE columns SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Colonne non trouvée' });
        }

        res.status(200).json({ id, name });
    });
};


export const deleteColumn = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM columns WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(204).send();
    });
};

export const getCard = (req, res) => {
    db.query('SELECT * FROM cards', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

export const createCard = (req, res) => {
    const { name, description, column_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom requis' });

    db.query('INSERT INTO cards (name, description, column_id) VALUES (?, ?, ?)', [name, description || '', column_id || null], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ id: result.insertId, name, description: description || '', column_id: column_id });
    });
};

export const updateCard = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) return res.status(400).json({ error: 'Pas d’ID de carte fourni' });


    db.query('UPDATE cards SET name = COALESCE (?, name), description = COALESCE(?, description) WHERE id = ?', [name, description, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carte non trouvée' });
        }

        res.status(200).json({ id, name, description });
    });
};


export const deleteCard = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cards WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(204).send();
    });
};
