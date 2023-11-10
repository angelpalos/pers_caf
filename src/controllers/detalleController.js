function mas(req,res){
    const folio = req.body.folio;
    const id_prod = req.body.producto;
    //console.log('producto:',id_prod,'  Folio:',folio);
    req.getConnection((err,conn)=>{
        conn.query('UPDATE detalle SET cantidad=cantidad+1 WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
            conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                if(err){
                    res.json(err);
                }
                conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                    res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                })
            })
        })
    })
}

function menos(req,res){
    const folio = req.body.folio;
    const id_prod = req.body.producto;
    const cant = req.body.cant;
    //console.log('producto:',id_prod,'  Folio:',folio,'  cantidad:',cant);
    req.getConnection((err,conn)=>{
        if(cant > 1){
            conn.query('UPDATE detalle SET cantidad=cantidad-1 WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
                conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                    if(err){
                        res.json(err);
                    }
                    conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                        res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                    })
                })
            })
        }else{
            conn.query('delete from detalle WHERE folio=? and id_producto=?',[folio,id_prod],(err,plus) =>{
                conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio,a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[folio], (err, deta)=>{
                    if(err){
                        res.json(err);
                    }
                    conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[folio],(err,subtotal)=>{
                        res.render('pages/detalle_agrega', {deta, folio:folio,subtotal})
                    })
                })
            }) 
        }
    })
}

function destroy(req,res){
    const folio = req.body;
    //console.log('Folio:',folio.folio);
    req.getConnection((err,conn) =>{
        conn.query('delete from pedido where folio=?',[folio.folio],(err,del)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/');
        })
    })
}

module.exports={
    mas,
    menos,
    destroy
}