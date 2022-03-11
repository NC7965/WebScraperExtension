var selectores = {
    nombre:"#personal-data > div.content-top > div.content-type-text > h3",
    idiomas:"#languages-data > div:nth-child(3) > table > tbody",
    telefono:"#personal-data > div.content-top > div.content-type-text > dl.list-default.soft-script.margin-top > dd:nth-child(2)",
    fechaNacimiento:"#personal-data > div.content-top > div.content-type-text > dl:nth-child(2) > dd:nth-child(2)",
    ciudadResidencia:"#personal-data > div.content-top > div.content-type-text > dl:nth-child(2) > dd:nth-child(5)",
    email:"#personal-data > div.content-top > div.content-type-text > dl:nth-child(3) > dd",
    elementosExperiencia:"#experience > ul > li > a",
    elementosEstudios:"#studies-data > ul > li > a",
    elementosIdiomas:"#languages-data > div:nth-child(3) > table > tbody > tr",
    carnetConducir:"#other-data > dl > dd:nth-child(2)",
    elementosConocimientos: "#skills > ul > li",
    otrosDatos: "#other-data > dl",
    situacionLaboralPreferencias: "#future-job > dl",
    cvEnTexto: "#text-cv-data > div.panel-default.panel-clipboard.soft-script > p"
}

var datosExtraidos = {
    nombre:extraerSingleData(selectores.nombre),
    idiomas:extraerSingleData(selectores.idiomas),
    telefono:extraerSingleData(selectores.telefono),
    fechaNacimiento:extraerSingleData(selectores.fechaNacimiento),
    ciudadResidencia:extraerSingleData(selectores.ciudadResidencia),
    email:extraerSingleData(selectores.email),
    experienciaLaboral:extraerExperiencia(selectores.elementosExperiencia),
    estudios:extraerEstudios(selectores.elementosEstudios),
    idiomas:extraerIdioma(selectores.elementosIdiomas),
    carnetConducir:extraerSingleData(selectores.carnetConducir),
    conocimientos:extraerMultipleData(selectores.elementosConocimientos),
    cvEnTexto:extraerSingleData(selectores.cvEnTexto),
    sitioWeb: "infojobs"
}
extraerKeyValueTable(selectores.otrosDatos)
extraerKeyValueTable(selectores.situacionLaboralPreferencias)
var json_data = {

    datosExtraidos: datosExtraidos
}

// Extrae un campo mediante querySelector y el selector CSS, comprueba si existe
function extraerSingleData(querySelector) {
    dato = document.querySelector(querySelector)
    if(dato != null) {
        return dato.innerText
    } else {
        return null
    }
}
// Extrae multiples elementos mediante querySelectorAll y un selector CSS, sustituye los \n que encuentre, los introduce en un array y devuelve el array
function extraerMultipleData(querySelector) {
    var array = []
    elementos = document.querySelectorAll(querySelector)
    elementos.forEach(e => {
        var elemento = e.innerText //.replaceAll("\n", "-")
        array.push(elemento)
    })
    return array
}

function extraerEstudios(querySelector) {
    var array = []
    elementosEstudios= document.querySelectorAll(querySelector)
    elementosEstudios.forEach(e => {
        var titulo = e.getElementsByTagName("abbr")
        var especialidad = e.getElementsByTagName("h3")
        var institucion = e.getElementsByTagName("dd")[0]
        var resultado = {
            titulo: titulo[0].innerText,
            especialidad: especialidad[0].innerText,
            institucion: institucion.innerText
        }
        array.push(resultado)
    })
    return array
}

function extraerIdioma(querySelector) {
    var array = []
    elementosIdioma = document.querySelectorAll(querySelector)
    elementosIdioma.forEach(e=> {
        var idioma = e.getElementsByTagName("th")
        var nivel = e.getElementsByTagName("span")
        var comentario = e.getElementsByTagName("p")
        var resultado = {
            idioma: idioma[0].innerText,
            nivel: nivel[0].innerText,
        }
        if(comentario[0] != undefined) {
            resultado["comentario"] = comentario[0].innerText
        }
        array.push(resultado)
    })
    return array
}

function extraerExperiencia(querySelector) {
    var array = []
    elementosExperiencia = document.querySelectorAll(querySelector)
    elementosExperiencia.forEach(e=> {
        var cargo = e.getElementsByTagName("h3")
        var keys = e.getElementsByTagName("dt")
        var values = e.getElementsByTagName("dd")
        var descripcion = e.getElementsByTagName("p")
        var skills = e.getElementsByTagName("li")
        var resultado = {
            cargo: cargo[0].innerText
        }
        if(keys.length == values.length) {
            resultado["empresa"] = values[0].innerText
            resultado["fechasYDuracion"] = values[1].innerText
            if(descripcion.length > 0) {
                resultado["descripcion"] = descripcion[0].innerText
            }
            if(skills.length > 0) {
                var arrayHabilidades = []
                for(var i = 0; i <skills.length;i++) {
                    arrayHabilidades.push(skills[i].innerText)
                }
                resultado["habilidades"] = arrayHabilidades
            }
            /*for(var i=0; i<keys.length; i++ ) {
                resultado[keys[i].innerText]= values[i].innerText
            }*/
        } else {

        }
        array.push(resultado)
    })
    return array
}

function extraerKeyValueTable(querySelector) {
    var arrayTable = []
    tabla = document.querySelector(querySelector)
    var keys = tabla.getElementsByTagName("dt");
    var values = tabla.getElementsByTagName("dd");
    if(keys.length == values.length) {
        for(var i=0; i<keys.length; i++ ) {
            datosExtraidos[keys[i].innerText]= values[i].innerText
        }
        return arrayTable
    } else { // TODO: Revisar
        return null
    }

}

/*var json_data = {
    nombre: datosExtraidos.nombre,
    idiomas: datosExtraidos.idiomas,
    telefono: datosExtraidos.telefono,
    fechaNacimiento: datosExtraidos.fechaNacimiento,
    email: datosExtraidos.email,
    experiencia: datosExtraidos.experiencias,
    estudios: datosExtraidos.estudios,
    idiomas: datosExtraidos.idiomas,
    carnetConducir: datosExtraidos.carnetConducir
}*/

chrome.runtime.sendMessage(json_data)
