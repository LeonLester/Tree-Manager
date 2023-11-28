# Use an official Node runtime as a parent image
FROM node:21.1.0 AS install_packages

# Set the working directory in the container
WORKDIR /vue-app

# Copy package.json and package-lock.json to the working directory
COPY vue-app/package.json vue-app/package-lock.json /vue-app/

# Install dependencies
RUN     npm install \
    &&  npm install -g create-vite \
    &&  create-vite vue-app --template vue

FROM install_packages AS final_image

# Set the working directory to the newly created app
WORKDIR /vue-app/vue-app

# Expose port 3000
EXPOSE 3000

# Use the npm script to run the development server
CMD ["npm", "run", "dev"]
