# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY index.html ./
COPY css/ ./css/
COPY js/ ./js/
COPY server.js ./
COPY assets/ ./assets/
COPY articles/ ./articles/

# Create data directory with proper permissions
RUN mkdir -p data/articles && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
