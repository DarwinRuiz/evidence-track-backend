
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


COPY tsconfig*.json ./
COPY src ./src

RUN pnpm build


FROM node:20-alpine

WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile


COPY --from=builder /app/build ./build


ENV PORT=3000

EXPOSE 3000

CMD ["node", "build/server.js"]
