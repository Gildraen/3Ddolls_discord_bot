FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18-alpine as application
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ ./
USER node
EXPOSE 80
EXPOSE 3000
EXPOSE 8080
CMD ["yarn", "start"]
