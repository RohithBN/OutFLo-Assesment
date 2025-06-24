FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build the application
RUN npm run railway:build

# Expose port (Railway will override this)
EXPOSE 5000

# Start the application
CMD ["npm", "run", "railway:start"]
