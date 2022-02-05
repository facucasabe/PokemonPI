const { Router } = require("express");
const axios = require("axios");
const { Pokemon, Tipo } = require("../db");

const router = Router();

const getApiInfo = async () => {
  const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon");
  // const apiUrl = await fetch('https://pokeapi.co/api/v2/pokemon')
  // console.log(apiUrl);
  const apiInfo = await apiUrl.data.results.map((p) => {
    return {
      // id: p.id,
      name: p.name,
      // life: p.life,
      // strength: p.strength,
      // defense: p.defense,
      // speed: p.speed,
      // height: p.height,
      // weight: p.weight,
      // createInDb: p.createInDb,
      // image: p.image,
      // tipo: p.tipo.map((data) => data),
    };
  });

  return apiInfo;
};

const getDbInfo = async () => {
  return await Pokemon.findAll({
    include: {
      model: Tipo,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

const getAllPokemons = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// [ ] GET /pokemons:
// Obtener un listado de los pokemons desde pokeapi.
// Debe devolver solo los datos necesarios para la ruta principal
// [ ] GET /pokemons?name="...":
// Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
// Si no existe ningún pokemon mostrar un mensaje adecuado

router.get("/pokemons", async (req, res) => {
  // /pokemons y /pokemons?name=...
  const apiData_20 = await axios.get("https://pokeapi.co/api/v2/pokemon");
  const apiData_40 = await axios.get(apiData_20.data.next);
  const apiData_final = [
    ...apiData_20.data.results,
    ...apiData_40.data.results,
  ];

  const result = await Promise.all(
    apiData_final.map(async (pokemon) => {
      let pokemonInfoAxios = (await axios.get(pokemon.url)).data;
      let pokemonInfoAxiosFiltered = {
        id: pokemonInfoAxios.id,
        types: pokemonInfoAxios.types,
        urlImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonInfoAxios.id}.png`,
      };
      return {
        pokemonName: pokemon.name,
        pokemonInfo: pokemonInfoAxiosFiltered,
      };
    })
  );

  console.log(result);
  res.status(200).json(result);
});

// const apiData_20= await axios.get('https://pokeapi.co/api/v2/pokemon');
// const apiData_40= await axios.get(apiData_20.data.next);
// const apiData_final= [...apiData_20.data.results, ...apiData_40.data.results];

// const result= await Promise.all(
//     apiData_final.map(async(pokemon)=>{
//         return  {
//             pokemonName:pokemon.name,
//             pokemonInfo:(await axios.get(pokemon.url)).data
//         }
//     })
// )

// console.log(result)
// res.status(200).json(result);

// [ ] GET /pokemons/{idPokemon}:
// Obtener el detalle de un pokemon en particular
// Debe traer solo los datos pedidos en la ruta de detalle de pokemon
// Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes

router.get("/pokemons/{idPokemon}", async (req, res) => {});

// [ ] POST /pokemons:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
// Crea un pokemon en la base de datos
// [ ] GET /types:
// Obtener todos los tipos de pokemons posibles
// En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí

module.exports = router;
