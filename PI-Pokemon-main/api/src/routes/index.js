const { Router } = require("express");
const axios = require("axios");
const { Pokemon, Tipo } = require("../db");

const router = Router();

// const getApiInfo = async () => {
//   try {
//   const apiUrl = (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=40")) // array con {name, url}
//     .data.results;
//   const apiInfo = apiUrl.map((p) => axios.get(p.url));  
//   const dataResults = await Promise.all(apiInfo);
//   let pokeInfo = await dataResults.map((p) => p.data);
//   let allPokemon = pokeInfo.map((u) => {
//     return {
//       id: u.id,
//       name: u.name,
//       life: u.stats[0].base_stat,
//       attack: u.stats[1],
//       defense: u.stats[2].base_stat,
//       speed: u.stats[5].base_stat,
//       height: u.height,
//       weight: u.weight,
//       img: u.sprites.other.dream_world.front_default,
//       types: u.types.map((t) => t.type.name),
//     };
//   })
//   console.log(allPokemon);
//   }
//   catch (error) {return error}
  
// };

// getApiInfo()

const getApiInfo = async () => {
  const apiUrl = await axios.get (`https://pokeapi.co/api/v2/pokemon?limit=40`); //TRAE LA DATA GENERAL. NAME Y URL
  const apiInfo = await apiUrl.data.results.map(el => {
      return {
          url: el.url
      }
  })
  // const pokemonNext = await axios.get(apiUrl.data.next)
  // const nextInfo = await pokemonNext.data.results.map(el => {
  //     return {
  //     url: el.url
  //     }
  // }) 
  // console.log(nextInfo)
  
  // const apisConcat = apiInfo.concat(nextInfo)

  let showAll = apiInfo.map(el => {
      return axios.get(el.url)
  })

  showAll = await Promise.all(showAll);  

  const finalInfo = await showAll.map(u => {
      return {
          
          img: u.data.sprites.other.home.front_default,
          name: u.data.name,
          types: u.data.types.map(t => t.type.name),
          life: u.data.stats[0].base_stat,
          attack: u.data.stats[1].base_stat,
          defense: u.data.stats[2].base_stat,
          speed: u.data.stats[5].base_stat,
          height: u.data.height,
          weight: u.data.weight,
          id: u.data.id,
      
  }
}) 
  return finalInfo
}

const getDbInfo = async () => {
  try {  
  return await Pokemon.findAll({
    include: {
      model: Tipo,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  })}
  catch(error) {return error};
};


const getAllPokemons = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  
  // return [...apiInfo,...dbInfo]
  const infoTotal = apiInfo.concat(dbInfo)
  // console.log(typeof(dbInfo))
  return infoTotal;
};




// // [ ] GET /pokemons:
// // Obtener un listado de los pokemons desde pokeapi.
// // Debe devolver solo los datos necesarios para la ruta principal
// // [ ] GET /pokemons?name="...":
// // Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
// // Si no existe ningún pokemon mostrar un mensaje adecuado

router.get("/pokemons", async (req, res) => {
  const name = req.query.name;
  const allPokemon = await getAllPokemons();
  
  if (name) {
    const pokeName = allPokemon.filter((p) => p.name.includes(name));
    pokeName.length
      ? res.status(202).json(pokeName)
      : res.status(404).json("Pokemon Not Found");
  } else {
    res.status(202).json(allPokemon);
  }
});


// // [ ] GET /types:
// // Obtener todos los tipos de pokemons posibles
// // En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí

router.get('/types', async (req, res) => {
  const typesApi = await axios.get (`https://pokeapi.co/api/v2/type?limit=20`);
  const types = await typesApi.data.results.map(el => el.name)
  console.log(types)
  types.forEach(el => {
       Tipo.findOrCreate({
          where: { name: el }
      })
  }) 
const allTypes = await Tipo.findAll()
console.log(allTypes)
  res.send(allTypes)
})


// // [ ] GET /pokemons/{idPokemon}:
// // Obtener el detalle de un pokemon en particular
// // Debe traer solo los datos pedidos en la ruta de detalle de pokemon
// // Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes



router.get('/pokemon/:id', async(req,res)=>{
  const { id } = req.params;  
  // if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(`${id}`))
  if (id.includes('-')){
      try {
          const pokemonId = await Pokemon.findByPk(id, {include: Tipo});

          let pokemonTypesId = {
              id: pokemonId.id,
              name: pokemonId.name, 
              img: pokemonId.img,
              life: pokemonId.life,
              attack : pokemonId.attack,
              defense: pokemonId.defense,
              speed: pokemonId.speed,
              height: pokemonId.height,
              weight: pokemonId.weight,
              // createdDb: pokemonId.createdDb,
              types: pokemonId.types.map(t => t.name)
          }
          if (pokemonTypesId) return res.status(200).json(pokemonTypesId);
      } catch (error) {
          return res.status(404).json({error: `No se encontro ${id}` });
      }
  } else {
    try {
      let pokemon_Id = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          pokemon_Id ={
              id     : pokemon_Id.data.id,
              name   : pokemon_Id.data.name, 
              img  : pokemon_Id.data.sprites.other.dream_world.front_default,
              life  : pokemon_Id.data.stats[0].base_stat,
              attack : pokemon_Id.data.stats[1].base_stat,
              defense: pokemon_Id.data.stats[2].base_stat,
              speed  : pokemon_Id.data.stats[5].base_stat,
              height : pokemon_Id.data.height,
              weight : pokemon_Id.data.weight,
              types  : pokemon_Id.data.types.map(t => t.type.name)
          };
res.json(pokemon_Id)
  } catch (error) {
      return res.status(404).json({error: `No se encontro ${id}` });
  }
}})

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


// [ ] POST /pokemons:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
// Crea un pokemon en la base de datos

router.post('/pokemons/', async (req, res) => {
  let {  name, life, attack, defense, speed, height, weight, img, types } = req.body
  try {
  let pokemonCreated = await Pokemon.create({
    name, life, attack, defense, speed, height, weight, img
  })
  types.forEach(async type => {
    let pokemonType = await Tipo.findOne({
      where: {name: type }
    })
    await pokemonCreated.addTipo(pokemonType)
  })
  return res.status(200).send(pokemonCreated)
}
catch (error) {
  next(error)
}
})

module.exports = router;
