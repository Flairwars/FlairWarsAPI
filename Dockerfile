# Specify a base image
FROM node:lts-alpine

#Install some dependencies
WORKDIR /code
COPY ./ /code
RUN npm install

# Set up a default command
CMD [ "npm","start" ]
