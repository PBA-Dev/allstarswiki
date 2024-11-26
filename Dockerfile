# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install MongoDB client tools
RUN apk add --no-cache mongodb-tools

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create data directory with proper permissions
RUN mkdir -p /usr/src/app/data && \
    chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
