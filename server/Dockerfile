FROM node:20-alpine

WORKDIR /app

# Copy package.json for backend
COPY server/package*.json ./
RUN npm install

# Copy backend files directly into /app
COPY server/* .  

EXPOSE 4000

CMD ["node", "index.js"]
