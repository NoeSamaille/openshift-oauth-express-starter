# Starter Node.js App with OpenShift OAuth2 authentication

Starter application for authentication your app users with OpenShift OAuth2 client.

With this approach you can manage your app users based on OpenShift RBAC:

```
oc adm groups new admins
oc adm groups add-users admins IAM#noe.samaille@ibm.com
```

## Run locally

```sh
export OCP_OAUTH_CONFIG='{{"authorization_endpoint":...}'
npm install
npm start
```

**Note**: the following attributes of `$OCP_OAUTH_CONFIG` are required:
```json
{
    "authorization_endpoint": "<authorization_endpoint>",
    "token_endpoint": "<token_endpoint>",
    "clientID": "<clientID>",
    "clientSecret": "<clientSecret>",
    "api_endpoint": "<api_endpoint>"
} 
```