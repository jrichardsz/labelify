FROM node:14
WORKDIR /usr/app
COPY . .
RUN rm -rf /usr/app/src/test
RUN npm install
EXPOSE 8080
CMD ["npm","run","start"]
