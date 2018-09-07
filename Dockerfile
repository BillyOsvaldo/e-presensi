FROM node:9.7
RUN npm install -g yarn

# Create app directory
WORKDIR /usr/src/app

ENV APP_DIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

RUN yarn install --production

COPY . ./

#RUN yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "yarn", "start" ]