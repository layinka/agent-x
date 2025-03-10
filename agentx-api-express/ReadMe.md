## AgentX API

## Run
- Install Packages `npm install`
- Set Environment variables
- Run `npm run dev`
- Visit `http://localhost:3000/<api calls>`


### Swagger Docs
`http://localhost:3000/api-docs/`


## Deploy
`pm2 start npm --name "agentx-api" -- start --interpreter=/root/.nvm/versions/node/v22.14.0/bin/node --only prod `