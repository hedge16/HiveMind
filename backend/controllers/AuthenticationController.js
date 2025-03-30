"use strict";
import { User } from "../db/db.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Può essere rimosso se non è più necessario

export class AuthController {
  /**
   * Handles post requests on /auth. Checks that the given credentials are valid
   * @param {http.IncomingMessage} request 
   * @param {http.ServerResponse} response 
   */
  static async checkCredentials(req, res) {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" }); // Se l'utente non esiste
    }

    // Confronta la password fornita con quella hashata nel database
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" }); // Se la password è errata
    }

    return true; // Se la password è corretta, ritorna `true`
  }

  /**
   * Attempts to create a new User
   */
  static async saveUser(req, res) {
    try {
      let user = new User({
        email: req.body.email,
        password: req.body.password, // La password sarà hashata automaticamente dal hook nel modello
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      await user.save(); // Salva l'utente nel database
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving user", error: error.message });
    }
  }

  static issueToken(email) {
    return Jwt.sign({ user: email }, process.env.TOKEN_SECRET, { expiresIn: `${24*60*60}s` });
  }

  static isTokenValid(token, callback) {
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }

  static getUserByEmail(email) {
    return User.findOne({
      where: {
        email: email
      }
    });
  }
}
