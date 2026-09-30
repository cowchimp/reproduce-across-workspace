FROM node:22-alpine

RUN apk add --no-cache postgresql17-client

WORKDIR /app
CMD ["node", "server.js"]
