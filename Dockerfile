# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server files
COPY server/ ./
COPY index.html ./
COPY css/ ./css/
COPY js/ ./js/
COPY data/ ./data/

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
