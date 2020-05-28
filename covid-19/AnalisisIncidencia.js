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
    <GChart id="grafico"
      type="ColumnChart"
      :data="chartData"
      :options="chartOptions"
    />
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
        chartData: [],
        chartOptions: {
          isStacked: true,
          chartArea: {
            left: 80,
            top: 38, 
            bottom: 80, 
            width:'100%',
            height:'100%'
          },
          dataOpacity: 0.5,
          animation: {"startup": true},
          bar: {groupWidth: "85%"},
          legend: 'top',
          title: '',
          colors: ['teal', 'red', 'orange'],
          hAxis: {
            textStyle: { 
              color: '#757575',
            }   
          },
          vAxis: {
            textStyle: { 
              color: '#757575',
            }   
          },
        },        
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
        this.chartData = [
          ["Data", "PCR", "Test ràpid", "Sospitós"],
        ]

        if (municipio == "(Total Catalunya)") {
          municipio = ""
        }
        if (municipio.length) {
          condicion = 'where municipidescripcio = "' + municipio + '" '
        } else {
          condicion = ' '
        }
        axios.get('https://analisi.transparenciacatalunya.cat/resource/jj6z-iyrp.json?$query=select data, sum(numcasos * case(resultatcoviddescripcio="Positiu PCR", 1, true, 0)) as PCR, sum(numcasos * case(resultatcoviddescripcio="Positiu per Test Ràpid", 1, true, 0)) as RAPID, sum(numcasos * case(resultatcoviddescripcio="Sospitós", 1, true, 0)) as SOSPITOS '  + condicion + ' group by data order by data' )
        .then((response) => {
          // this.geolocalizacion = response.data.datos.data.geo
          console.log(response.data)
          response.data.forEach(element => {
            fechaActual = new Date(element.data.substring(0, 4), element.data.substring(5, 7), element.data.substring(8, 10))
            if (fechaEsperada == "") {
               fechaEsperada = fechaActual
            }
            // añadimos un registro con 0 por cada día para los cuales no existen valores, entre la última
            // fecha con valor y la fecha del valor actual
            while (date_diff_indays(fechaActual, fechaEsperada)) {
              datos = []
              datos.push(fechaEsperada.getFullYear() + "-" + this.ceros(fechaEsperada.getMonth(), 2) + "-" + this.ceros(fechaEsperada.getDate(), 2))
              datos.push(0)
              datos.push(0)
              datos.push(0)
              this.chartData.push(datos)
              fechaEsperada.setDate(fechaEsperada.getDate()+1);
              fechaControl = fechaActual

            }
            datos = []
            datos.push(element.data.substring(0, 10))
            datos.push(parseInt(element.PCR))
            datos.push(parseInt(element.RAPID))
            datos.push(parseInt(element.SOSPITOS))
            this.chartData.push(datos)
          })

          // Guardamos la última fecha con información si se trata de la consulta del total. En caso contrario.
          // generamos un registro con 0 desde el último dia con datos para el municipio y el último día con
          // datos del global. Así se hace evidente que hay días sin nuevos casos, en lugar de que la última 
          // información está desactualizada.
          if (municipio == "") {
            this.ultima_fecha = fechaControl
          } else {
            while (date_diff_indays(this.ultima_fecha, fechaActual)) {
              datos = []
              datos.push(fechaActual.getFullYear() + "-" + this.ceros(fechaActual.getMonth(), 2) + "-" + this.ceros(fechaActual.getDate(), 2))
              datos.push(0)
              datos.push(0)
              datos.push(0)
              this.chartData.push(datos)
              fechaActual.setDate(fechaActual.getDate()+1);
            }
            datos = []
            datos.push(fechaActual.getFullYear() + "-" + this.ceros(fechaActual.getMonth(), 2) + "-" + this.ceros(fechaActual.getDate(), 2))
            datos.push(0)
            datos.push(0)
            datos.push(0)
            this.chartData.push(datos)
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
