# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

# Set the API URL during build (important for client-side environment variables)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
