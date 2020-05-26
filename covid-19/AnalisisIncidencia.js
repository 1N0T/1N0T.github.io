const AnalisisIncidencia = Vue.component('analisisIncidenciaComponent', { 
  template: `
  <div>
  <!--
  =======================================================================================
  Lista de elementos
  =======================================================================================-->
  <div class="w3-row w3-text-teal">
    <div class="w3-col lista" :style="{height: windowHeight - 38 +'px', width: anchoLista + 'px'}">
      <div class=w3-row>
        <div class="w3-col m12 cf">
          <input class="w3-input w3-border" type="text" v-model="filtroLista" placeholder="Municipi ...">
        </div>
      </div>
      <div class=w3-row>
        <div class="w3-col m3 cf" @click="ordenarLista('numorden')">
          <b>Casos</b> 
          <span v-if="ordenLista.columna == 'numorden' && ordenLista.orden == 'asc'" ><i class="fa fa-caret-up"></span> 
          <span v-if="ordenLista.columna == 'numorden' && ordenLista.orden == 'desc'"><i class="fa fa-caret-down"></span>
        </div>
        <div class="w3-col m9 cf" @click="ordenarLista('municipio')">
          <b>Municipi</b>
          <span v-if="ordenLista.columna == 'municipio' && ordenLista.orden == 'asc'" ><i class="fa fa-caret-up"></span> 
          <span v-if="ordenLista.columna == 'municipio' && ordenLista.orden == 'desc'"><i class="fa fa-caret-down"></span>
        </div>
      </div>
      <div class="listacontent" :style="{height: windowHeight - 150 +'px', width: anchoLista + 'px'}">
      <div class="w3-row w3-hover-orange" v-for="item in listaFiltrada" @click="cargarMunicipio(item.municipio)">
        <div class="w3-col m3 cf">{{ item.positivos }}</div>
        <div class="w3-col m9 cf">{{ item.municipio }}</div>
      </div>
    </div>
  </div>
  <!--
  =======================================================================================
  Ficha de datos
  =======================================================================================-->
  <div class="w3-container w3-rest ficha" :style="{height: windowHeight - 38 +'px'}">
    <chartjs-bar :datalabel="datalabel" :labels="labels" :data="dataset" :bind="true"></chartjs-bar>
  </div>
</div>
`    
,

    data: function() {
      return {

        windowWidth: 0,
        windowHeight: 0,
        
        anchoLista: 350,
        filtroLista: '',
        ordenLista: {
          columna: '',
          orden: ''
        },        
        lista: [],

        dataentry: null,
        datalabel: "Positius (PCR + tests ràpids)",
        labels: [],
        dataset: [],
        ultima_fecha: null
      }

    },

    methods: {
      cargarPoblaciones() {
        axios.get('https://analisi.transparenciacatalunya.cat/resource/jj6z-iyrp.json?$query=select municipidescripcio, sum(numcasos) as numcasos where resultatcoviddescripcio like "Positiu%25" group by municipidescripcio order by municipidescripcio ')
        .then((response) => {
          total_catalunya = 0
          response.data.forEach(element => {
            total_catalunya += parseInt(element.numcasos)
            this.lista.push({
              "positivos": element.numcasos, 
              "numorden": this.ceros(element.numcasos, 10), 
              "municipio": element.municipidescripcio})
          })
          this.lista.push({
            "positivos": total_catalunya, 
            "numorden": this.ceros(total_catalunya, 10), 
            "municipio": "(Total Catalunya)"})
        })
      },
 
      ceros(numero, longitud) {
        let s = "00000000000000" + numero
        return s.substr(s.length - longitud)

      },

      cargarMunicipio(municipio) {
        let fechaEsperada = ""
        let fechaActual = ""
        let fechaControl = ""
        let condicion = ""

        if (municipio == "(Total Catalunya)") {
          municipio = ""
        }
        if (municipio.length) {
          condicion = 'where resultatcoviddescripcio like "Positiu%25" and municipidescripcio = "' + municipio + '" '
        } else {
          condicion = 'where resultatcoviddescripcio like "Positiu%25"'
        }
        this.labels = []
        this.dataset = []
        axios.get("https://analisi.transparenciacatalunya.cat/resource/jj6z-iyrp.json?$query=select data, sum(numcasos) as numcasos "  + condicion + " group by data order by data ")
        .then((response) => {
          // this.geolocalizacion = response.data.datos.data.geo
          response.data.forEach(element => {
            fechaActual = new Date(element.data.substring(0, 4), element.data.substring(5, 7), element.data.substring(8, 10))
            if (fechaEsperada == "") {
               fechaEsperada = fechaActual
            }
            // añadimos un registro con 0 por cada día para los cuales no existen valores, entre la última
            // fecha con valor y la fecha del valor actual
            while (date_diff_indays(fechaActual, fechaEsperada)) {
              this.labels.push(fechaEsperada.getFullYear() + "-" + this.ceros(fechaEsperada.getMonth(), 2) + "-" + this.ceros(fechaEsperada.getDate(), 2))
              this.dataset.push(0)
              fechaEsperada.setDate(fechaEsperada.getDate()+1);
              fechaControl = fechaActual
            }
            this.labels.push(element.data.substring(0, 10))
            this.dataset.push(element.numcasos)
          })

          // Guardamos la última fecha con información si se trata de la consulta del total. En caso contrario.
          // generamos un registro con 0 desde el último dia con datos para el municipio y el último día con
          // datos del global. Así se hace evidente que hay días sin nuevos casos, en lugar de que la última 
          // información está desactualizada.
          if (municipio == "") {
            this.ultima_fecha = fechaControl
          } else {
            while (date_diff_indays(this.ultima_fecha, fechaActual)) {
              this.labels.push(fechaActual.getFullYear() + "-" + this.ceros(fechaActual.getMonth(), 2) + "-" + this.ceros(fechaActual.getDate(), 2))
              this.dataset.push(0)
              fechaActual.setDate(fechaActual.getDate()+1);
            }
            this.labels.push(fechaActual.getFullYear() + "-" + this.ceros(fechaActual.getMonth(), 2) + "-" + this.ceros(fechaActual.getDate(), 2))
            this.dataset.push(0)
          }
        })
      },

      ordenarLista(columna) {
        // Si la lista ya ha sido clasificada por la columna actual cambiamos el orden
        if (this.ordenLista.columna == columna) {
          if (this.ordenLista.orden == 'asc') {
            this.ordenLista.orden = 'desc'
          } else {
            this.ordenLista.orden = 'asc'          
          }
        } else {
          this.ordenLista.columna = columna
          this.ordenLista.orden   = 'asc'
        }
        sortObjectArrayByKey(this.lista, this.ordenLista.columna, this.ordenLista.orden)
      },      

      getWindowWidth(evento) {
        this.windowWidth = document.documentElement.clientWidth;
      },
  
      getWindowHeight(evento) {
        this.windowHeight = document.documentElement.clientHeight;
      },     
      
    },

    computed: {
      listaFiltrada() {
        return this.lista.filter(( objeto ) => {
          let cadena = objeto['positivos'].toString() + objeto['municipio'].toString()        
          let aBuscar = this.filtroLista
          return searchIgnoringAccents(cadena, aBuscar)
        })
      }    
    },
    
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('resize', this.getWindowHeight);
          
        this.getWindowWidth()
        this.getWindowHeight()
      }),          
      this.cargarPoblaciones()
      this.cargarMunicipio("")
    }

})
