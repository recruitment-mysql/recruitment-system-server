# Base image
FROM node:18.18.0

# App directory
WORKDIR /app

# Copy package info
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

RUN mkdir -p dist/schema/types && cp src/schema/types/*.graphql dist/schema/types/

# Copy the rest of the app
COPY . .

# Build TypeScript → dist/
RUN npm run build

# Expose port your app listens on
EXPOSE 4000

# Start the server (from dist/)
CMD ["npm", "start"]
