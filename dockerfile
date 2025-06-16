FROM  node:20-alpine

WORKDIR /app

COPY package.json .
COPY . .

RUN npm install 

# Build the server
RUN npm run build

CMD [ "npm", "run", "start" ]