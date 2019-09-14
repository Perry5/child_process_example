FROM node:10.13.0-alpine


# Create Directory for the Container
WORKDIR /app/

# Only copy the package.json file to work directory
COPY . /app/

# Install all Packages
RUN npm install && \
    npm run build


# Copy all other source code to work directory
ADD . /app/

# TypeScript
#RUN npm run tsc

# Start
CMD [ "npm", "start" ]
EXPOSE 4040