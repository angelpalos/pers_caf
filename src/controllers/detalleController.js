//Funcion que suma la cantidad del producto
function mas(req,res){
    //recibe los datos enviados
    const folio = req.body.folio;
    const id_prod = req.body.producto;
    //actualiza la cantidad sumando 1;
    req.getConnection((err,conn)=>{
        conn.query('UPDATE detalle SET cantidad=cantidad+1 WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
            //obtiene los detalles del pedido
            conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                if(err){
                    res.json(err);
                }
                //Obtiene el subtotal del precio del pedido
                conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                    //redirige a la pagina donde se mostraran los datos
                    res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                })
            })
        })
    })
}

//Funcion que resta o elimina algun producto
function menos(req,res){
    //recibe los datos enviados
    const folio = req.body.folio;
    const id_prod = req.body.producto;
    const cant = req.body.cant;
    
    req.getConnection((err,conn)=>{ //crea la conexion
        if(cant > 1){ // verifica que la cantidad sea mayor a 1
            //actualiza la cantidad restando 1;
            conn.query('UPDATE detalle SET cantidad=cantidad-1 WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
                //obtiene los detalles del pedido
                conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                    if(err){
                        res.json(err);
                    }
                    //Obtiene el subtotal del precio del pedido
                    conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                        //redirige a la pagina donde se mostraran los datos
                        res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                    })
                })
            })
        }else{ // la cantidad es igual o menor que 1
            //elimina el producto
            conn.query('delete from detalle WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
                //obtiene los detalles del pedido
                conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                    if(err){
                        res.json(err);
                    }
                    //Obtiene el subtotal del precio del pedido
                    conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                        //redirige a la pagina donde se mostraran los datos
                        res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                    })
                })
            }) 
        }
    })
}

//Funcion que elimina el pedido 
function destroy(req,res){
    //recibe los datos enviados
    const folio = req.body;
    //elimina el pedido
    req.getConnection((err,conn) =>{
        conn.query('delete from pedido where folio=?',[folio.folio],(err,del)=>{
            if(err){
                res.json(err);
            }
            //redirige a la raiz
            res.redirect('/');
        })
    })
}

//Exporta las funciones
module.exports={
    mas,
    menos,
    destroy
}