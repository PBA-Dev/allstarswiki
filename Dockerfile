# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create data directory with proper permissions
RUN mkdir -p data && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
