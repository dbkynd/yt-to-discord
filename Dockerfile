FROM node:latest
WORKDIR /app
COPY . .
RUN yarn
ENTRYPOINT ["node", "/app/index.js"]
