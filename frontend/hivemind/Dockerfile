# Usa una versione stabile di Node.js
FROM node:latest

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari per installare le dipendenze (package.json e package-lock.json)
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto dei file
COPY . .

# Espone la porta dell'app (porta predefinita per Angular è 4200)
EXPOSE 4200

# Comando per avviare l'applicazione
CMD [ "npm", "start" ]