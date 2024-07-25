# build stage
# FROM node:14 as build-stage

# WORKDIR /app
# COPY . .
# RUN npm install && npm run build

# production stage
# FROM nginx:stable as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM nginx:stable-perl
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

