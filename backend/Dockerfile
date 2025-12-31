FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
