const { Router} = require('express');
const axios = require('axios');
const {Dog, Temperament} = require("../db.js")
const { API_KEY} = process.env;
const {formateoDb, formateoApi} = require("../controllers/controllers");

const router = Router();


router.get('/dogs', async(req, res, next) => {
  try {
    const dogApi = (await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)).data
    const dogDb = await Dog.findAll({include: Temperament});

    const validandoDogsDb = await formateoDb(dogDb)
    const validandoDogsApi = await formateoApi(dogApi)

    const allDog = await validandoDogsApi.concat(validandoDogsDb)
    
    res.json(allDog)

  } catch (error) {
    next(error)
  }
})




router.post('/dogs', async(req, res) => {
  const {name, height_min, height_max, weight_min, weight_max, temperament} = req.body;
  if(!name || !height_min || !height_max || !weight_min || !weight_max) {
    return res.status(400).send({msg: "Falta enviar datos obligatorios"})
  }
  try {
    const dog = await Dog.create(req.body)

    await dog.addTemperament(temperament)

    return res.status(201).send({msg: "Perro creado correctamente"})
  } catch (error) {
    console.log(error)
  }
})


router.get("/temperaments", async (req, res) => {
    const temperamentsApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
    const temperaments = temperamentsApi.data.map(t => t.temperament);
    const temps = temperaments.toString().split(",");
    temps.forEach(el => {
        let i = el.trim()
        Temperament.findOrCreate({
             where: { name: i }
        })
    })

    const allTemp = await Temperament.findAll();    
    res.send(allTemp);
});





router.get('/dogs/:idRaza', async(req, res, next) => {
  const {idRaza} = req.params;
  if(!idRaza) {
    return res
      .status(400)
      .send({msg: "Falta enviar datos obligatorios"})
  }
  try {
    const dogApi = (await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)).data
    const dogDb = await Dog.findAll({include: Temperament});

    const validandoDogsDb = await formateoDb(dogDb)
    const validandoDogsApi = await formateoApi(dogApi)

    const allDog = await validandoDogsDb.concat(validandoDogsApi)

    const dog = allDog.filter(d => d.id == idRaza)

    return res
      .status(200)
      .send(dog)
  } catch (error) {
    next(error)
  }
})


module.exports = router;