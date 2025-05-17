# CM API
#### API project _Building a Node.js/TypeScript Graphql/Apollo API_ :
* * *
## Prerequisites
* Install Docker.
* Install Docker Compose.
* Install Nodejs (This project is built at node version: **19.7.0**).
## Running Project
1. Create file .env with following content then copy to root folder **_`chat-api-server`_**
```shell
NODE_ENV=development

# Admin server configuration
SERVER_HOST=localhost
SERVER_PORT=4003
SECRET=super-secret-training2023
```shell
npm install --legacy-peer-deps
```
3. From project folder(chat-api-server) run command (For sync database):
```shell
SYNC_DATA=true docker-compose up -d --build
```
4. From project folder run command :
```shell
docker-compose up -d --build
```