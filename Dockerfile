# Building stage, uses all dependencies in node_modules
FROM node:12.18.3-alpine AS builder
WORKDIR /apps/service-kiosk
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage, uses optimized image and pruned node_modules
FROM node:12.18.3-alpine AS production
ENV NODE_ENV=production

WORKDIR /apps/service-kiosk
COPY package.json yarn.lock ./
COPY --from=builder /apps/service-kiosk/dist ./dist
COPY --from=builder /apps/service-kiosk/node_modules ./node_modules

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN /usr/local/bin/node-prune

CMD ["node", "dist/main"]