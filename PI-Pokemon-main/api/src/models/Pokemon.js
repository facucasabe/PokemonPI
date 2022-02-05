const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("pokemon", {
    idPokemon: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // },
      // life: {
      //   type: DataTypes.DECIMAL,
      //   // allowNull: false,
      // },
      // strength: {
      //   type: DataTypes.DECIMAL,
      //   allowNull: false,
      // },
      // defense: {
      //   type: DataTypes.DECIMAL,
      //   allowNull: false,
      // },
      // speed: {
      //   type: DataTypes.DECIMAL,
      //   allowNull: false,
      // },
      // height: {
      //   type: DataTypes.DECIMAL,
      //   allowNull: false,
      // },
      // weight: {
      //   type: DataTypes.DECIMAL,
      //   allowNull: false,
      // },
      // createdInDb: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: true,
      // },
      // image: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
    },
  });
};
