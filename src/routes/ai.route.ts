import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { LoginWithGoogleDto } from '@/dtos/login.dto';
import { AIController } from '@/controllers/ai.controller';
import { UserPromptDTO, UserMessagePromptDTO } from '@/dtos/ai.dto';

export class AIRoute implements Routes {
  public path = '/ai';
  public router = Router();
  public aiController = new AIController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/prompt` , AuthMiddleware, ValidationMiddleware(UserMessagePromptDTO), this.aiController.prompt);

    this.router.post(`${this.path}/prompt-test` , ValidationMiddleware(UserPromptDTO),  this.aiController.promptTest);
   
  }
}
