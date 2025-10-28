import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur mon serveur' });
});

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});

// gestion des erreurs
server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} nécessite des privilèges élevés.`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} est déjà utilisé.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});