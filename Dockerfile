FROM node:9
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i && npm i -g make && npm cache clean --force
COPY . .
ARG MAKE
ENV MAKE=$MAKE
CMD make $MAKE