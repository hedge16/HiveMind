"use strict";
import express from "express";
import { AuthController } from "../controllers/AuthenticationController.js";

export const authenticationRouter = express.Router();

/**
 * @swagger
 *  /auth:
 *    post:
 *      description: Authenticate user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: user credentials to authenticate
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: example@gmail.com
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                  user:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      email:
 *                        type: string
 *                        example: example@gmail.com
 *                      firstName:
 *                        type: string
 *                        example: John
 *                      lastName:
 *                        type: string
 *                        example: Doe
 *        401:
 *          description: Invalid credentials
 */
authenticationRouter.post("/auth", async (req, res) => {
  try {
    const isAuthenticated = await AuthController.checkCredentials(req, res);
    if (isAuthenticated) {
      const token = AuthController.issueToken(req.body.email);
      const user = await AuthController.getUserByEmail(req.body.email); // Recupera i dati dell'utente
      res.json({ token, user }); // Risponde con il token e i dati dell'utente
    } else {
      res.status(401).json({ error: "Invalid credentials. Try again." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred during authentication." });
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     description: Signup user
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: user credentials to signup
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@example.com
 *               password:
 *                 type: string
 *                 example: p4ssw0rd
 *               firstName: 
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: User signed up
 *       500:
 *         description: Could not save user
 */

authenticationRouter.post("/signup", (req, res, next) => {
  AuthController.saveUser(req, res).then((user) => {
    res.json(user);
  }).catch((err) => {
    next({status: 500, message: "Could not save user"});
  })
});