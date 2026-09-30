FROM node:22-alpine

RUN corepack enable

WORKDIR /opt/todo-app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=secret,id=npm_ca \
    if [ -f /run/secrets/npm_ca ]; then \
      export NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca; \
      export npm_config_cafile=/run/secrets/npm_ca; \
    fi; \
    pnpm install --prod --frozen-lockfile --ignore-scripts

ENV NODE_PATH=/opt/todo-app/node_modules

WORKDIR /app
CMD ["node", "server.js"]
