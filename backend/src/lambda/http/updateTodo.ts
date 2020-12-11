import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event)
  const todoId = event.pathParameters.todoId
 
  const validTodoId = await todoExists(todoId)

  if (!validTodoId){
    return{
      statusCode:404,
      headers:{
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const oldTodoId = await retrieveOld(todoId)
 

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const updatedItem = {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    createdAt: oldTodoId.createdAt,
    attachmentUrl: oldTodoId.attachmentUrl,
    ...updatedTodo
  }


  await docClient.put({
    TableName: todosTable,
    Item: updatedItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}

async function todoExists(todoId: string){
  const result = await docClient
    .get({
      TableName: todosTable,
      Key:{
        todoId: todoId
      }
    })
    .promise()
    return !!result.Item
}

async function retrieveOld(todoId: string){
  const result = await docClient.get({
    TableName: todosTable,
    Key:{
      todoId: todoId
    }
  }).promise()

  return result.Item
}