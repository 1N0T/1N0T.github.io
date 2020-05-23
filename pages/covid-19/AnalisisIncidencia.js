const AnalisisIncidencia = Vue.component('analisisIncidenciaComponent', { 
  template: `
    <div>
    <h1>analisis incidencia</h1>
    </div>`
    ,


    data: function() {
      return {
        titulo: 'Análisis Incidencia',

      }
    },
    methods: {
      cargarTodo() {
        axios.get("https://soda.demo.socrata.com/resource/4tka-6guv.json?$query=select%20source,%20number_of_stations%20%20where%20magnitude%20%3E%203.0%20and%20depth%20%3C%2015")
        .then((response) => {
          // this.geolocalizacion = response.data.datos.data.geo
          console.log(response.data)
        })
      },
    },
    mounted() {
      this.cargarTodo()
    }

})
