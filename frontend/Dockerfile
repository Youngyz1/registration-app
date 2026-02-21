# ---------- Build Stage ----------
FROM node:18-alpine as build
WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package*.json ./
COPY .npmrc ./
COPY craco.config.js ./

RUN npm install --legacy-peer-deps

# Fix ajv version conflict
RUN npm install ajv@^8.0.0 ajv-keywords@^5.0.0 --legacy-peer-deps

# Patch the broken formatLimit file that causes 'date' TypeError
RUN sed -i 's/var format = formats\[name\]/var format = formats \&\& formats[name]/' \
    node_modules/fork-ts-checker-webpack-plugin/node_modules/ajv-keywords/keywords/_formatLimit.js 2>/dev/null || true

COPY . .

RUN npx craco build

# ---------- Production Stage ----------
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]