# --- Stage 1: Build React App ---
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json + package-lock.json
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of code
COPY . .

# Build the frontend (output goes to /app/dist)
RUN npm run build


# --- Stage 2: Serve with NGINX ---
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
