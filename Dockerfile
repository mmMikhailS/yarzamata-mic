# First stage: Build the application
FROM node:20 AS build

WORKDIR /yArzamataDev
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install
RUN npx prisma generate

# Second stage: Use the built application
FROM node:20

WORKDIR /yArzamataDev
COPY package*.json ./
RUN npm install --only-production

# Copy the built files from the "build" stage
COPY --from=build /yArzamataDev ./

EXPOSE 5000
CMD ["npm", "run", "start"]