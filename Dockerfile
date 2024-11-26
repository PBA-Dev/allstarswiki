# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
