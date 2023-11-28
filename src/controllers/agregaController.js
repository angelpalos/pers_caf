//Proceso que realiza la busqueda del menu
function buscar(req, res){
    //Recupera los datos insertados
    const data = req.body;
    const folio = req.body.folio;
    const busc = "%"+data.buscador+"%";

    //obtiene los datos necesarios para mostrar los productos
    req.getConnection((err, conn)=>{
      conn.query("SELECT a.*, b.descripcion, d.folio FROM product a,articulo b,units c JOIN pedido d ON d.folio =? WHERE a.tipo_art = b.tipo_art AND a.unidad = c.unidad AND a.name like ? ORDER BY a.name ASC", [folio,busc], (err, pers) => {
        if(err){
            res.json(err);
        }
        //redirige a la pagina donde esta el menu enviando los datos obtenidos
        res.render('pages/agregar', {pers, folio:folio})
    
      });
    });
}

//Proceso que recupera los datos para mostrarlos en el menu
function indexp(req, res) {
    //Recupera los datos insertados
    const folio = req.body.folio;
    //obtiene los datos necesarios para mostrar los productos
    req.getConnection((err, conn) => {
        conn.query('SELECT a.*,b.descripcion, d.folio from product a, articulo b, units c join pedido d on d.folio=? WHERE a.tipo_art = b.tipo_art AND a.unidad = c.unidad ORDER BY a.name ASC',[folio], (err, pers) => {
          //redirige a la pagina donde esta el menu enviando los datos obtenidos  
          res.render('pages/agregar',{pers, folio: folio});
        });
      }); 
}

//Funcion que agrega el producto al pedido
function agrega(req,res) {
    //Recupera los datos insertados
    const id_producto = req.body.id_producto;    
    const folio = req.body.folio;
   
    req.getConnection((err,conn)=>{ 
        //Comprueba si el producto que se quiere agregar ya existe
        conn.query('select * from detalle where id_producto = ? and folio = ?',[id_producto,folio],(err,row)=>{
            let rows = Object.keys(row).length; //El método Object.keys() devuelve un arreglo de propiedades de un objeto Mientras que lenght da la cantidad de datos de ese arreglo.
            if(rows > 0){ // si existe el producto
              //Suma 1 a la cantidad
                const cant = row[0].cantidad + 1;
                //actualiza el pedido
                conn.query('update detalle set cantidad=? where id_producto = ? and folio = ?',[cant,id_producto,folio],(err,det)=>{
                    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta) => {
                        if(err) {
                          res.json(err);
                        }
                        //obtiene el subtotal del precio del pedido
                        conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                          //redirige a la pagina donde se mostraran los datos
                          res.render('pages/detalle_agrega', {deta, folio:folio, subtotal});
                        })
                      })
                })
            } else { //no existe el producto
              //obtiene los datos necesario para insertar el nuevo producto 
                conn.query('select precio,name from product where id_producto = ?',[id_producto],(err,prod)=>{
                    let precio = prod[0].precio;
                    let name = prod[0].name;
                    // inserta el nuevo producto
                    conn.query('insert into detalle set folio=?,id_producto=?,precio=?,cantidad=1,name=?',[folio,id_producto,precio,name],(err,insert)=>{
                        if (err) throw err;
                        //obtiene el subtotal del precio del pedido
                        conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta) => {
                            conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                              //redirige a la pagina donde se mostraran los datos
                              res.render('pages/detalle_agrega', {deta, folio:folio, subtotal});
                            })
                          })
                    })
                })
            }
        })
    })
}

//exporta las funciones
module.exports = {
    buscar,
    indexp:indexp,
    agrega
}