
 
//CREAMOS LA BASE DE DATOS
if(!db){
var db = openDatabase("usuarios", "1.0", "Base de datos de prueba", 5*1024*1024);
}
//CREAMOS LA TABLA PERSONAS
var sql = "CREATE TABLE IF NOT EXISTS personas(id INTEGER PRIMARY KEY, fecha TEXT, nombre TEXT, apellido TEXT, mail TEXT, nacimiento DATE, dni TEXT, pais TEXT, provincia TEXT, ciudad TEXT)";
db.transaction(
  function(tx){
    tx.executeSql(sql, [],
      function(tx, result){
        listarPersonas();
      },
      function(tx, error){
        alert('Error: ' + error.message);
      }
    );
  }
);

//ELIMINAMOS LA TABLA personas
function borrarTabla(){
var sql = "DELETE FROM personas";
this.db.transaction(
  function(tx){
    tx.executeSql(sql, [],
      function(tx, result){
        listarPersonas();
      },
      function(tx, error){
        alert('Error: ' + error.message);
      }
    );
  }
);
}


//INSERTAMOS DATOS EN LA TABLA
function altaPersona(){

 var nombre = $("#inputNombre").val();
 var apellido = $("#inputApellido").val();
 var mail = $("#inputMail").val();
 var nacimiento = $("#inputNacimiento").val();
 var dni = $("#inputDNI").val();
 
 if(nombre==""){
  $(".error-nombre").show();
  $("#inputNombre").focus();
  return;
 }

  if(apellido==""){
  $(".error-apellido").show();
  $("#inputApellido").focus();
  return;
 }
  if(mail==""){
  $(".error-mail").show();
  $("#inputMail").focus();
  return;
 }
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)){
  $(".error-mail-2").hide();
 }
 else
 {
  $(".error-mail-2").show();
  $("#inputMail").focus();
  return;

 }
 
  if(dni==""){
  $(".error-dni").show();
  $("#inputDNI").focus();
  return;
 }
  
  var hoy = new Date();
  dia = hoy.getDate();
  mes = hoy.getMonth()+1;
  anio= hoy.getFullYear();
  fecha_actual = String(dia+"/"+mes+"/"+anio);
  var fecha = fecha_actual;
  var pais=$("#selectPais").find('option:selected').text();
  var provincia=$("#selectProvincia").find('option:selected').text();
  var ciudad=$("#selectCiudad").find('option:selected').text();

 
    
 var sql = "INSERT INTO personas (fecha, nombre, apellido, mail, nacimiento, dni, pais, provincia, ciudad) values (?,?,?,?,?,?,?,?,?)";
  db.transaction(
    function(tx){
      tx.executeSql(sql, [fecha, nombre, apellido, mail, nacimiento, dni, pais, provincia, ciudad],
        function(tx, result){
         window.scrollTo(0,0);
         $("#msj-alerta").html('Registro dado de alta correctamente');
         $("#msj-alerta").show();
         listarPersonas();
          resetear();
          setTimeout(function(){$("#msj-alerta").hide()}, 5000); 
          })
          },
        function(tx, error){
          alert('Error: ' + error.message);
        }
      );
    }
  

function cerrarMsj(msj){
  $('.'+msj+'').hide();
  $('.error-mail-2').hide();
}

function resetear(){
    $('#formulario').each (function(){
  this.reset();

});
}
function listarPersonas(){
  n = 1;
// X es desde donde quiero comenzar a eliminar
// N Es donde quiero terminar
$('#tabla tbody>tr').each(function() {
   
      $(this).remove();

});

var sql = "SELECT * FROM personas order by id DESC";
db.transaction(
  function(tx){
    tx.executeSql(sql, [],
      function(tx, result){
        if (result.rows.length > 0){
          var size = result.rows.length;
          var str = "";
          for(var i=0; i < size; i++){
            var persona = result.rows.item(i);
            str += "Nombre: " + persona.nombre + " - apellido: " + persona.apellido + "\n";
          
          $('#tabla > tbody:last').append('<tr><td>'+persona.id+'</td><td>'+persona.nombre+'</td><td>'+persona.apellido+'</td><td>'+persona.dni+'</td><td>'+persona.mail+'</td><td><a class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext" href="javascript:eliminapersona('+persona.id+')">eliminar</a></td></tr>');
        }
        }else{
          
        }
      },
      function(tx, error){
        alert('Error: ' + error.message);
      }
    );
  }
);
}

 
function eliminaPersona(id)
  {

    if (confirm('Esta seguro que desea eliminar este registro '+id))
    {
     var sql = 'DELETE FROM personas WHERE id='+id+'';
    this.db.transaction(
      function(tx){
        tx.executeSql(sql, [],
          function(tx, result){
            listarPersonas();
            
            },
          function(tx, error){
            alert('Error: ' + error.message);
      }
    );
  }
); 

   }
}
function borraPersonas()
  {

     var sql = 'DELETE FROM personas';
    this.db.transaction(
      function(tx){
        tx.executeSql(sql, [],
          function(tx, result){
            listarPersonas();
            
            },
          function(tx, error){
            alert('Error: ' + error.message);
      }
    );
  }
); 
}
//CARGA PAISES EN COMBO
$.get("paises.xml", function (xml) {
    $(xml).find("pais").each(function () {
       var nombre = $(this).find('nombre').text();
       $("#selectPais").append("<option value=\""+nombre+"\">"+nombre+"</option>");
    });
});

$("#selectPais").change(function(){
  var select = $(this).val();
  if(select=="Argentina"){
    $("#selectProvincia").append("<option value='0'>Seleccione...</option>");
    cargaProvincias();

  }
  else
  {
    $('#selectProvincia').empty();
    $('#selectCiudad').empty();
  }
})

function cargaProvincias(){

 $.get("provincias.xml", function (xml) {
    $(xml).find("provincia").each(function () {
       var id = $(this).find('id').text();
       var nombre = $(this).find('nombre').text();
       $("#selectProvincia").append("<option value=\""+id+"\">"+nombre+"</option>");
    });
});
}
$("#selectProvincia").change(function(){
  var select = $(this).val();
  $("#selectCiudad").empty();
  $("#selectCiudad").append("<option value='0'>Seleccione...</option>");
  $.get("localidades.xml", function (xml) {
    $(xml).find('localidad').each(function () {
      if(select==$(this).find('id_provincia').text()){
       var id = $(this).find('id').text();
       var nombre = $(this).find('nombre').text();
       $("#selectCiudad").append("<option value=\""+id+"\">"+nombre+"</option>");
    }
    });
});
})
function cerrarBorrar()
{
  $( "#menu-borrar" ).collapsible( "option", "collapsed", true );
  }

