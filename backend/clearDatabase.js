import fs from 'fs';

const dbPath = './mydb.sqlite'; // Percorso del database

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Database eliminato.');
} else {
    console.log('Nessun database trovato.');
}
