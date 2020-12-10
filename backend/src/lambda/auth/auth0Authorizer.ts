import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'

import {verify } from 'jsonwebtoken'
import {JwtToken} from '../../auth/JwtToken'
const auth0Secret = process.env.AUTH_0_SECRET

export const handler: CustomAuthorizerHandler = async(event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  try {    
    const decodedToken = verifyToken(event.authorizationToken)
    console.log('user was authorized A: ', decodedToken)
    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken (authHeader:string) : JwtToken{
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')

    console.log(authHeader)
    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, auth0Secret) as JwtToken

}
