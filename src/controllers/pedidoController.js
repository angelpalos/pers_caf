const { query } = require("express");

function pedido(req, res) {
  const correo = req.body.email;
  let i = 0;
  var email='email';

  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status WHERE b.id_status=1', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      while(pedi.length>i){
        //console.log(pedi[i]);
        pedi[i].email=correo;
        //console.log(pedi[i]);
        i=i+1;
      }
      
      
      res.render('pages/pedidos', {pedi});
    });
  });
}

function en_proceso(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT a.name,a.ap_paterno,b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status JOIN users a ON a.email=b.corre_emp WHERE b.id_status=2;', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      res.render('pages/en-proceso', { pedi,email: req.session.email });
    });
  });
}

function terminado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT a.name,a.ap_paterno,b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status JOIN users a ON a.email=b.corre_emp WHERE b.id_status=3;', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      res.render('pages/terminado', { pedi,email: req.session.email });
    });
  });
}

function pagado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT a.name,a.ap_paterno,b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status JOIN users a ON a.email=b.corre_emp WHERE b.id_status=4;', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("--------",pedi)
      res.render('pages/pagado', { pedi,email: req.session.email });
    });
  });
}

function entregado(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT a.name,a.ap_paterno,b.folio,b.fecha,d.tip_status,b.id_status FROM pedido b JOIN status d ON b.id_status=d.id_status JOIN users a ON a.email=b.corre_emp WHERE b.id_status=5;', (err, pedi) => {
      if(err) {
        res.json(err);
      }
      //console.log("--------",pedi)
      res.render('pages/entregado', { pedi,email: req.session.email });
    });
  });
}



function detalle(req, res) {
  const datos=req.body;
  //console.log("Datos",datos);
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[datos.folio], (err, deta) => {
      if(err) {
        res.json(err);
      }
      //console.log('detalle',deta);
      let state_num = deta[0].id_status;
      if (state_num == 1){
        stat = 'En proceso';
      } else if (state_num == 2){
        stat = 'Terminado';
      } else if (state_num == 4){
        stat = 'Entregado';
      }
      conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[datos.folio],(err,subtotal)=>{
        //console.log(subtotal);
        res.render('pages/detalle', {deta,email:datos.email, folio:datos.folio, status: stat,id_stat: state_num, subtotal});
      })
      
    })
  })
}

function detalle_agr(req, res) {
  const datos=req.body;
  //console.log("------folio-----",datos);
  req.getConnection((err, conn) => {
    conn.query('SELECT b.folio, b.id_status , c.name, a.cantidad, a.precio, a.id_producto FROM pedido b JOIN detalle a ON a.folio = b.folio JOIN product c ON a.id_producto = c.id_producto where b.folio = ?',[datos.folio], (err, deta) => {
      if(err) {
        res.json(err);
      }
      let state_num = deta[0].id_status;
      conn.query('SELECT sum(cantidad*precio) AS subtotal FROM detalle WHERE folio = ?',[datos.folio],(err,subtotal)=>{
        
        res.render('pages/detalle_agrega', {deta, folio:datos.folio, subtotal,email: req.session.email});
      }) 
    })
  })
}

function marca (req, res) {
  const data = req.body;
  
  req.getConnection((err, conn) =>{
    if(data.stat == 1){
      //console.log(data.email);
      conn.query('UPDATE pedido SET id_status=id_status+1, corre_emp=? where folio = ? ',[data.email,data.folio], (err, pers) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/');
      })
      

    } else  {
      conn.query('UPDATE pedido SET id_status=id_status+1 where folio = ? ',[data.folio], (err, pers) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/');
      })
    }
    
  })
}

module.exports = {
 detalle:detalle,
 detalle_agr,
 pedido,
 en_proceso,
 marca,
 terminado,
 pagado,
 entregado,
}