const router = new VueRouter({
   mode: 'hash',
   routes: [
     { path: '/',           component: AnalisisIncidenciaMobile },
   ],
   linkActiveClass:      "w3-green",  // active class for non-exact links.
   linkExactActiveClass: "w3-orange"  // active class for exact links.
})
 
