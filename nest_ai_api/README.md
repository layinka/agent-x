# Nest.js + AI SDK Example

You can use the AI SDK in an [Nest.js](https://nestjs.com/) server to generate and stream text and objects.

## Usage

1. Create .env file with the following content (and more settings, depending on the providers you want to use):

```sh
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

2. Run the following commands from the root directory of the AI SDK repo:

```sh
npm install
```

3. Run the following command:

```sh
npm run start:dev
```

4. Test the endpoint with Curl:

```sh
curl -X GET http://localhost:8181
```


## Swagger/Open API

`http://localhost:8181/api`