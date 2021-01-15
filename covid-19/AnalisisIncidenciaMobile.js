const AnalisisIncidenciaMobile = Vue.component('analisisIncidenciaComponent', { 
  template: `
  <div>
  <!--
  =======================================================================================
  Botonera
  =======================================================================================-->
  <div class="botonera">
    <div>
      <div class="w3-row">
        <div class="w3-col" style="width:50px">
          <i class="fa fa-list w3-xlarge" @click="listaAbierta = !listaAbierta"></i>
        </div>
        <div class="w3-rest">
          {{ municipioSeleccionado }}
          <input id="dias" type="number" v-model="dias">
          dies
        </div>
      </div>
    </div>
  </div>

  <!--
  =======================================================================================
  Lista de elementos
  =======================================================================================-->
  <div class="w3-row w3-text-teal">
    <div class="w3-col lista" v-show="listaAbierta" :style="{height: windowHeight - 38 +'px', width: '100%'}">
      <div class=w3-row>
        <div class="w3-col m12 cf">
          <input class="w3-input w3-border" id="busqueda" type="text" v-model="filtroLista" placeholder="Municipi ...">
        </div>
      </div>
      <div class=w3-row>
        <div class="w3-col m12 cf" @click="ordenarLista('municipio')">
          <b>Municipi</b>
          <span v-if="ordenLista.columna == 'municipio' && ordenLista.orden == 'asc'" ><i class="fa fa-caret-up"></span> 
          <span v-if="ordenLista.columna == 'municipio' && ordenLista.orden == 'desc'"><i class="fa fa-caret-down"></span>
        </div>
      </div>
      <div class="listacontent" :style="{height: windowHeight - 150 +'px', width: '100%'}">
      <div class="w3-row w3-hover-orange"
           v-for="item in listaFiltrada" :key="item.municipio" 
           :class="{ 'w3-pink': (item.municipio == municipioSeleccionado) }" @click="cargarMunicipio(item.municipio)">
        <div class="w3-col m10 cf">{{ item.municipio }} ({{ item.positivos }})</div>
      </div>
    </div>
  </div>
  <!--
  =======================================================================================
  Ficha de datos
  =======================================================================================-->
  <div class="w3-container w3-rest ficha" v-show="!listaAbierta" :style="{height: windowHeight - 38 +'px'}">
  <i class="fa fa-refresh fa-spin fa-3x fa-fw w3-xlarge w3-display-middle" v-show="trabajando"></i>
  <GChart id="grafico"
      type="ColumnChart"
      :data="diasSeleccionados"
      :options="chartOptions" v-show="!trabajando"
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
        listaAbierta: false,
        dias: 60,
        ordenLista: {
          columna: '',
          orden: ''
        },        
        lista: [],
        municipioSeleccionado: '(Total Catalunya)',
        trabajando: false,
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
          dataOpacity: 1,
          animation: {"startup": true},
          bar: {groupWidth: "85%"},
          legend: 'top',
          title: '',
          colors: ['#0010aa', 'orange', '#00aabb'],
          backgroundColor: "",
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
        let condicion = ""
        this.chartData = []
        this.municipioSeleccionado = municipio
        this.trabajando = true
        this.listaAbierta = false
 
        if (municipio == "(Total Catalunya)") {
          municipio = ""
        }
        if (municipio.length) {
          condicion = 'where municipidescripcio = "' + municipio + '" '
        } else {
          condicion = ' '
        }
        axios.get('https://analisi.transparenciacatalunya.cat/resource/jj6z-iyrp.json?$query=select data, sum(numcasos * case(resultatcoviddescripcio="Positiu PCR", 1, true, 0)) as PCR, sum(numcasos * case(resultatcoviddescripcio="Positiu per Test Ràpid", 1, true, 0)) as RAPID, sum(numcasos * case(resultatcoviddescripcio="Positiu TAR", 1, true, 0)) as TAR '  + condicion + ' group by data order by data' )
        .then((response) => {
          response.data.forEach(element => {
            datos = []
            datos.push(element.data.substring(0, 10))
            datos.push(parseInt(element.PCR))
            datos.push(parseInt(element.RAPID))
            datos.push(parseInt(element.TAR))
            this.chartData.push(datos)
          })

          this.trabajando = false
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
      },
      diasSeleccionados() {
        return [["Data", "PCR", "Test ràpid", "Test Antigènic Ràpid"]].concat(this.chartData.slice(this.dias * -1))
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
      this.cargarMunicipio("(Total Catalunya)")
    }

})
