FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install the dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Expose the application's port
EXPOSE 3000

CMD [ "npm", "start" ]