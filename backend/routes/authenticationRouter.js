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
 *                usr:
 *                  type: string
 *                  example: Kyle
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */
authenticationRouter.post("/auth", async (req, res) => {
  let isAuthenticated = await AuthController.checkCredentials(req, res);
  if(isAuthenticated){
    res.json(AuthController.issueToken(req.body.email));
  } else {
    res.status(401);
    res.json( {error: "Invalid credentials. Try again."});
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