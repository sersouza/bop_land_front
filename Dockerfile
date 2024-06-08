FROM nginx
COPY . /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html/
EXPOSE 8000
RUN nginx