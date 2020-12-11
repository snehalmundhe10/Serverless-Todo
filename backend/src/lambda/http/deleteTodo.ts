import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

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

  
  
  var params = {
    TableName: todosTable,
    userId: parseUserId(jwtToken),
    Key: {
      todoId: todoId
    }
  }
  console.log("params", params)
  
  docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2))
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2))
    }
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:'Item deleted'
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

    console.log('Get todo: ', result)
    return !!result.Item
}
