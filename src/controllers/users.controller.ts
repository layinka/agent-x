import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';

export class UserController {
  public user = Container.get(UserService);

  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - users
   *     summary: Find all users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Successfully retrieved all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       500:
   *         description: Internal server error
   */
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags:
   *       - users
   *     summary: Find a user by ID
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: Successfully retrieved user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Internal server error
   */
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *       - users
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Internal server error
   */
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *       - users
   *     summary: Update a user by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Internal server error
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags:
   *       - users
   *     summary: Delete a user by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Internal server error
   */
  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}