import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJGmwqq0Q6fCCcMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1yNXl3YzNodC51cy5hdXRoMC5jb20wHhcNMjAxMjA5MTgxNjA4WhcN
MzQwODE4MTgxNjA4WjAkMSIwIAYDVQQDExlkZXYtcjV5d2MzaHQudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoohUzifjzhSv2yiU
40znsKpqPcSq4xzVcjvkiY8NLUFekFxjADC+fUIz+T6SkjKTS6lM5IsfNDU0MsQi
7gzChGb3WDX/9iJnxFzzyQ8HM1CzZFHFu4nwZISY7e/scMDTFQzL9hEE2f8W0Jun
oclTrcYLTVeyuhrpbdbwVEhMbz+UizHg4NOJNjWpAJAQGcHKraggBmix3dyXazZf
RcQBdnef60dAhJcKtDliLZZTBpxBkVu+QoMHhTCSGbMCanae+mFIUbL9Vy9kZfMu
LcHRKgivwo/JjPzu/Ah8XXaDHIWoMXdCQR7RHuDwUhB5+At/9aaMK5SpEVAjddIy
1eQfdwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTy3dDSsakt
myNM/ftWlC5vnV1MjTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AAv1qaARb/kQ2QAcXhsVLXGaE+sS5S5A46sLI40BO2iEwD0XrMhylal/Nqxxonx1
Tj3iLBoilUYH6AVr0X1XbMdrKggUGmbXX3qw0S2ULtobtuqxSwaRW6GxtMtTZUsT
grnW6KiaOvMbErCqKUppKHqHP/Zq5rbKLSHXOe8OnOM84T3WzUlGlh/sAFtFYc3C
rFWozUrpDOKWlBAs9SVuCeMeyVXzQsKQ0HZluaHzMDkqxe/7vOMlXQuHPJKC7WmR
44igrz1yhud6btXShV4UFIwnFb8hfBfdwK/Pzci7jE3sXZhzwqZF9k+L/I6jI/ZB
gWC0Jbs8PGkFTKeSVP2vmog=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
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
    console.log('User authorized', e.message)

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

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
