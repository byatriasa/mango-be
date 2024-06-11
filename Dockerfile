FROM node:20-alpine AS base

####################################################
# 1. Prepare monorepo by creating pruned version
FROM base AS setup
RUN apk add --no-cache libc6-compat
RUN apk update

# install turborepo globally
RUN yarn global add turbo

# Set working directory
WORKDIR /app

# Copy monorepo
COPY . .

# Prune monorepo
RUN turbo prune api --docker

####################################################
# Build app
FROM base AS builder
RUN apk add --no-cache libc6-compatp
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=setup /app/out/json/ .
COPY --from=setup /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project and its dependencies
COPY --from=setup /app/out/full/ .
COPY turbo.json turbo.json

# Run build process
RUN yarn turbo build --filter=api...

####################################################
# Create final image by only using necessary files
FROM base AS runner
WORKDIR /app

# copy main repo files
COPY --from=builder /app/package.json  ./package.json
COPY --from=builder /app/yarn.lock  ./yarn.lock
COPY --from=builder /app/node_modules/  ./node_modules/

# copy files from build result
COPY --from=builder /app/ .

# remove source files
RUN rm -r apps/**/src
RUN rm -r packages/**/src

# remove dev only packages
RUN rm -r packages/eslint-config
RUN rm -r packages/typescript-config

# remove dev only files
RUN rm -rf apps/**/tsconfig.json
RUN rm -rf packages/**/tsconfig.json
RUN rm -rf apps/**/.eslintrc.json
RUN rm -rf packages/**/.eslintrc.json
RUN rm -rf apps/**/Dockerfile
RUN rm -rf packages/**/Dockerfile
RUN rm -rf apps/**/nodemon.json
RUN rm -rf packages/**/nodemon.json

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 8080

CMD yarn workspace api run start