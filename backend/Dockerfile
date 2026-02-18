# Fly.io / Docker deployment for marketplace-workflow-backend
FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source
COPY . .

# Expose port (Fly sets PORT=8080)
EXPOSE 8080

# Run db push then start (use release_cmd in fly.toml for db push in production)
CMD ["sh", "-c", "npx prisma db push && npm start"]
