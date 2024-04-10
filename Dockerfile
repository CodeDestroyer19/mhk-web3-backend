# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Copy entrypoint.sh script into the container
COPY entrypoint.sh .

# Set executable permissions for entrypoint.sh
RUN chmod +x entrypoint.sh

# Copy the rest of the application code into the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set entry point to the entrypoint.sh script
ENTRYPOINT ["./entrypoint.sh"]

# Command to run your application (can be overridden by CMD)
CMD ["node", "index.js"]
