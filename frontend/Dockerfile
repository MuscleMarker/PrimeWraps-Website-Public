# Stage 1: Build the React application
FROM node:18-alpine AS build

# Install Doppler CLI
RUN apk add --no-cache curl gnupg &&     curl -Ls https://cli.doppler.com/install.sh | sh

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set the API URL during the build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application with Doppler using build argument
ARG DOPPLER_TOKEN
RUN doppler run --token=$DOPPLER_TOKEN -- npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine
RUN apk update && apk add --no-cache 'libxml2>=2.13.4-r6'

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]