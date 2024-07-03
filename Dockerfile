# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Run the Next.js start script
CMD ["npm", "run", "dev"]
