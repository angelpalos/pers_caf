function buscar(req, res){
    const data = req.body;
    const folio = req.body.folio;
    const busc = "%"+data.buscador+"%";
    //console.log(busc);
    //console.log(folio);
    req.getConnection((err, conn)=>{
      conn.query("SELECT a.*, b.descripcion, d.folio FROM product a,articulo b,units c JOIN pedido d ON d.folio =? WHERE a.tipo_art = b.tipo_art AND a.unidad = c.unidad AND a.name like ? ORDER BY a.name ASC", [folio,busc], (err, pers) => {
        if(err){
            res.json(err);
        }
        res.render('pages/agregar', {pers, folio:folio})
    
      });
    });
}

function indexp(req, res) {
    const folio = req.body.folio;
    req.getConnection((err, conn) => {
        conn.query('SELECT a.*,b.descripcion, d.folio from product a, articulo b, units c join pedido d on d.folio=? WHERE a.tipo_art = b.tipo_art AND a.unidad = c.unidad ORDER BY a.name ASC',[folio], (err, pers) => {
            res.render('pages/agregar',{pers, folio: folio});
        });
      }); 
}

function agrega(req,res) {
    const id_producto = req.body.id_producto;    
    const folio = req.body.folio;
    req.getConnection((err,conn)=>{
        conn.query('select * from detalle where id_producto = ? and folio = ?',[id_producto,folio],(err,row)=>{
            //console.log(row);
            let rows = Object.keys(row).length;
            //console.log(rows);
            if(rows > 0){
                const cant = row[0].cantidad + 1;
                conn.query('update detalle set cantidad=? where id_producto = ? and folio = ?',[cant,id_producto,folio],(err,det)=>{
                    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta) => {
                        if(err) {
                          res.json(err);
                        }
                        conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                          //console.log(subtotal);
                          res.render('pages/detalle_agrega', {deta, folio:folio, subtotal});
                        })
                      })
                })
            } else {
                conn.query('select precio,name from product where id_producto = ?',[id_producto],(err,prod)=>{
                    let precio = prod[0].precio;
                    let name = prod[0].name;
                    conn.query('insert into detalle set folio=?,id_producto=?,precio=?,cantidad=1,name=?',[folio,id_producto,precio,name],(err,insert)=>{
                        if (err) throw err;
                        conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta) => {
                            conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                              //console.log(subtotal);
                              res.render('pages/detalle_agrega', {deta, folio:folio, subtotal});
                            })
                          })
                    })
                })
            }
        })
    })
}

//res.render('pages/detalle_agrega',{deta});

module.exports = {
    buscar,
    indexp:indexp,
    agrega
}