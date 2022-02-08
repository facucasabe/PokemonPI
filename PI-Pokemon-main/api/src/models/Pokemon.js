const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("pokemon", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life: {
      type: DataTypes.DECIMAL,
    },
    attack: {
      type: DataTypes.DECIMAL,
    },
    defense: {
      type: DataTypes.DECIMAL,
    },
    speed: {
      type: DataTypes.DECIMAL,
    },
    height: {
      type: DataTypes.DECIMAL,
    },
    weight: {
      type: DataTypes.DECIMAL,
    },
    img: {
      type: DataTypes.STRING,
    },
    // types: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
  });
};
