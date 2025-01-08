# Use Node.js as the base image
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (same as in your `.env`)
EXPOSE 8080

# Start the app
CMD ["npm", "run", "dev"]
