# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code and config
COPY . .

# Build arguments for Vite environment variables
ARG VITE_N8N_COUPON_VALIDATE_URL
ARG VITE_N8N_REGISTRATION_URL
ARG VITE_N8N_PAYMENT_STATUS_URL
ARG VITE_N8N_TICKET_URL

ENV VITE_N8N_COUPON_VALIDATE_URL=$VITE_N8N_COUPON_VALIDATE_URL
ENV VITE_N8N_REGISTRATION_URL=$VITE_N8N_REGISTRATION_URL
ENV VITE_N8N_PAYMENT_STATUS_URL=$VITE_N8N_PAYMENT_STATUS_URL
ENV VITE_N8N_TICKET_URL=$VITE_N8N_TICKET_URL

# Build the production bundle
RUN npm run build

# Production Stage with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy and set up the runtime environment injection script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

