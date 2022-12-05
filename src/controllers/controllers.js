module.exports = {
    formateoDb : async function(dogDb) {
  
      const dbFormateo = dogDb.map(dog => {
        return {
          id: dog.id,
          image: dog.image,
          name: dog.name,
          weight_min: dog.weight_min,
          weight_max: dog.weight_max,
          height_min: dog.height_min,
          height_max: dog.height_max,
          life_span_min: dog.life_span_min,
          life_span_max: dog.life_span_max,
          temperament: dog.temperaments,
          creadoEnDB: dog.creadoEnDB
        }
      })
  
      const validandoDogsDb = dbFormateo.map(d => {
        if(!d.image) {
          d.image = "https://www.postable.com/blog/wp-content/uploads/2018/06/puppy2.jpg"
        }
        if(Array.isArray(d.temperament)) {
          d.temperament = d.temperament.map(t => t.name)
          d.temperament = d.temperament.join(", ")
        }
        return d
      })
      return validandoDogsDb
    },
  
    formateoApi : async function(dogApi) {
  
      const apiFormateo = dogApi.map(dog => {
        return {
          id: dog.id,
          image: dog.image.url,
          name: dog.name,
          weight_min: dog.weight.metric.slice(0, 2),
          weight_max: dog.weight.metric.slice(-2),
          height_min: dog.height.metric.slice(0, 2),
          height_max: dog.height.metric.slice(4),
          life_span_min: dog.life_span.slice(0, 2),
          life_span_max: dog.life_span.slice(4, -6),
          temperament: dog.temperament
        }
      })
  
      const validandoDogsApi = await apiFormateo.map(d => {
        if(!d.weight_min || d.weight_min==="Na") {
          d.weight_min = "6";
        }
        if(!d.weight_max) {
            d.weight_max = (parseInt(d.weight_min) + 3).toString();
          }
        
        if(!d.height_min) {
          d.height_min = "42"
        }
        if(!d.height_max) {
            d.height_max = (parseInt(d.height_min) + 3).toString();
        }
        
        if(!d.life_span_min) {
          d.life_span_min = "19"
        }
        if(!d.life_span_max) {
            d.life_span_max = (parseInt(d.life_span_min) + 2).toString();
          }
  
        if(!d.temperament) {
          d.temperament = "Stubborn, Active, Happy, Dutiful, Confident"
        }
  
        return d
      })
      return validandoDogsApi 
    }
  }