FROM node:latest
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
