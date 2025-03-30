"use strict";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs"; // Importa bcrypt

export function createUsers(database) {
  const User = database.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Hook per hashare la password prima che venga creata
  User.beforeCreate(async (user, options) => {
    if (user.password) {
      // Genera un salt e usa bcrypt per creare l'hash
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Hook per hashare la password prima che venga aggiornata (opzionale)
  User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return User;
};
