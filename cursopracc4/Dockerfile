FROM node:15
WORKDIR /usr/src/curso-pracc-4
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5555
CMD npm start