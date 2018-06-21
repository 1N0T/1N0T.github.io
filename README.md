# Bienvenida

<div>Hola, hoy es **{{ hoy }}**</div>

<script>
  new Vue({
    el: '#main',
    data: { 
      msg: 'mensaje'
    }, 
    computed: {
      hoy: function() {
        var hoy  = new Date()
        var dd   = hoy.getDate()
        var mm   = hoy.getMonth() + 1 // Enero es el 0
        var yyyy = hoy.getFullYear()
        if (dd < 10) {
          dd = '0' + dd
        } 
        if (mm < 10 ) {
          mm = '0' + mm
        } 
        var hoy = dd + '/' + mm + '/' + yyyy
        return hoy
      }
    }
  })
</script>

!> En los ficheros **Markdown**, **docsify** sólo ejecutará el primer **script tag**.