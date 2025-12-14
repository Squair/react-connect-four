# ---------- Base image ----------
FROM node:18-alpine AS base

# Enable Corepack for Yarn v3+
RUN corepack enable

WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps

# Copy only files needed to install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies (immutable ensures lockfile consistency)
RUN yarn install --immutable

# ---------- Build ----------
FROM deps AS build

# Copy source files
COPY . .

# Build TypeScript -> build/
RUN yarn build

# ---------- Production runtime ----------
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy Yarn runtime files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install only production dependencies
RUN yarn install --immutable

# Copy build output
COPY --from=build /app/build ./build

# Expose the port defined in .env (default 3001)
EXPOSE 3001

# Environment variables are injected at runtime (see .env.sample)
CMD ["yarn", "start"]
