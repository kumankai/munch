FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

EXPOSE 3000

# Run the app
CMD ["serve", "-s", "dist", "-p", "3000"]