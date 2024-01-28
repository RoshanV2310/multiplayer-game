# Use official Node.js image as the base image for backend
FROM node:14 as backend

WORKDIR /usr/src/app/backend

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

# Build the React app
FROM node:14 as frontend

WORKDIR /usr/src/app/frontend

COPY ./public .

# Use a lightweight Node.js image for the final production image
FROM node:14-alpine

WORKDIR /usr/src/app

# Copy only necessary files from backend and frontend builds
COPY --from=backend /usr/src/app/backend /usr/src/app/backend
COPY --from=frontend /usr/src/app/frontend /usr/src/app/public

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "./backend/server.js"]
