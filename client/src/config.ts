// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5o3kzdusw7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-r5ywc3ht.us.auth0.com',            // Auth0 domain
  clientId: 'sNMf9Z73kzE52Xk59Q796EolTBMOjgi5',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
