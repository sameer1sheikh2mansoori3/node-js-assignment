# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Install nodemon globally (for development purposes)
RUN npm install -g nodemon

# Copy the rest of your app code to the container
COPY . .

# Expose port 8080 (your app's port) to the host machine
EXPOSE 8080

# Run the app using the "dev" script in package.json
CMD ["npm", "run", "dev"]
