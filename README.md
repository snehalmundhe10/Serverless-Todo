# Serverless TODO

## Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# Functions implemented

* `Auth` - Implement a custom authorizer for API Gateway that is added to all other functions.

* `GetTodos` - Return all TODOs for a current user. A user id is extracted from a JWT token that is sent by the frontend

* `CreateTodo` - Create a new TODO for a current user. 

* `UpdateTodo` - Update a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file

* `DeleteTodo` - Delete a TODO item created by a current user. Expects an id of a TODO item to remove.

* `GenerateUploadUrl` - Return a pre-signed URL that can be used to upload an attachment file for a TODO item.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Screenshots of the application

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/serverless%20app-1.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/serverless%20app-2.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/createTodos.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/getTodos.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/updateTodos.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/item%20deleted.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/getuploadurl.png)

![Alt text](https://github.com/snehalmundhe10/todo/blob/main/screenshots/file%20upload.png)

## Author
Snehal Mundhe


