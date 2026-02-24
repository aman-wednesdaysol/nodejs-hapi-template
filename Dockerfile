FROM node:20
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
RUN mkdir -p /app-build
ADD . /app-build
WORKDIR /app-build
# RUN npm install -g yarn
RUN yarn --frozen-lockfile --network-timeout 100000 --cache-folder /tmp/yarn-cache
RUN yarn build:prod


FROM node:20-alpine
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
RUN apk add yarn
ADD package.json /
ADD . /
COPY --from=0 /app-build/dist ./dist

CMD ["yarn", "start"]
EXPOSE 9000