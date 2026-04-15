ARG NODE_IMAGE=node:22.16.0-alpine3.20

# This is the "base" stage - it's defined here
FROM $NODE_IMAGE AS base
RUN apk update && apk upgrade && apk add --no-cache curl dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

# This stage builds FROM the "base" stage above
FROM base AS development
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node .env.example .env
COPY --chown=node:node . .

# This stage builds FROM the "development" stage
FROM development AS build
RUN node ace build

# This stage builds FROM the "base" stage (skipping development)
FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node ./package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /home/node/app/build .

COPY --chown=node:node entrypoint.sh /home/node/app
RUN chmod +x /home/node/app/entrypoint.sh

ENTRYPOINT ["/home/node/app/entrypoint.sh"]
CMD ["node", "bin/server.js"]
