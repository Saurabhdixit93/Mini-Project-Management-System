# Use Node.js 16 alpine image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Expose port
EXPOSE 5173

# Build the app
RUN npm run build

# Serve the app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]