import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await dbConnection();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options: swaggerJSDoc.Options = {
      
      // swaggerDefinition: {
      //   info: {
      //     title: 'AgentX REST API',
      //     version: '1.0.0',
      //     description: 'Agent X docs',
      //   },

      // },
      apis: [ './src/controllers/*.ts'], //'swagger.yaml',
      // apis: ['./src/routes/*.ts', './src/controllers/*.ts','./src/routes/*.js', './src/controllers/*.js'],
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'AgentX API',
          version: '1.0.0',
          description: 'API documentation for AgentX',
        },
        servers: [
          {
            url: 'http://localhost:3000',
          },
        ],
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '123',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  example: 'password123',
                },
                walletAddress: {
                  type: 'string',
                  example: '0x1234567890abcdef',
                },
              },
            },

            AIPrompt: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  example: 'What is my wallet address',
                }
              },
            },

            AIPromptWithMessageDTO: {
              type: 'object',
              properties: {
                messages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      role: { 
                        type: 'string',
                        enum: ['system', 'user', 'assistant', 'data']
                      },
                      content: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time', nullable: true }
                    }
                  }
                }
              }
            },

            AIPromptResponse: {
              type: 'object',
              properties: {
                fullResponse: {
                  type: 'string',
                  example: 'Your address is 0x23...',
                },
                success: {
                  type: 'boolean'
                }
              },
            },
          },
        },

      }
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
