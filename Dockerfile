FROM node:16 AS builder

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm ci --loglevel verbose
RUN mkdir -p /frontend && cp -a /tmp/node_modules /frontend

WORKDIR /frontend
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /frontend/dist .
COPY --from=builder /frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
