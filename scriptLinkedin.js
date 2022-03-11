var selectores = {
    nombre:".pv-top-card > div.ph5 > div.mt2.relative > div:nth-child(1) > div:nth-child(1) > h1",
    //conocimientos:"#ember641 > div.pvs-list__outer-container > ul > li",
    ocupacion:".pv-top-card > div.ph5 > div.mt2.relative > div:nth-child(1) > div.text-body-medium.break-words",
    //telefono:"#personal-data > div.content-top > div.content-type-text > dl.list-default.soft-script.margin-top > dd:nth-child(2)",
    //fechaNacimiento:"#personal-data > div.content-top > div.content-type-text > dl:nth-child(2) > dd:nth-child(2)",
    ciudadResidencia:".pv-top-card > div.ph5 > div.mt2.relative > div.pb2.pv-text-details__left-panel > span.text-body-small.inline.t-black--light.break-words",
    //email:"#personal-data > div.content-top > div.content-type-text > dl:nth-child(3) > dd",
    //elementosExperiencia:"#experience > ul",
    //elementosEstudios:"#studies-data > ul",
    //elementosIdiomas:"#languages-data > div:nth-child(3) > table > tbody > tr",
    elementosSkills:".artdeco-card > div.pvs-list__outer-container > ul > li",
    //carnetConducir:"#other-data > dl > dd:nth-child(2)"
    acercaDe:".artdeco-card > div.display-flex.ph5.pv3 > div.full-width > div.pv-shared-text-with-see-more > div > span:nth-child(1)"
}
//document.querySelector("#ember1373 > div.pvs-list__outer-container > ul > li:nth-child(1) > div")
//*[@id="ember114"]/div[2]/div[2]/div[1]/div[1]/h1
//  /html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[1]/div[2]/div[2]/div[1]/div[1]/h1
var datosExtraidos = {
    nombre:extraerSingleData(selectores.nombre),
    ocupacion:extraerSingleData(selectores.ocupacion),
    ciudadResidencia:extraerSingleData(selectores.ciudadResidencia),
    acercaDe:extraerSingleData(selectores.acercaDe),
    skills:extraerMultipleData(selectores.elementosSkills)
}

var json_data = {
    metadata: {
        sitioWeb:"linkedIn"
    },
    datosExtraidos: datosExtraidos
}

function extraerSingleData(querySelector) {
    dato = document.querySelector(querySelector)
    if(dato != null) {
        return dato.innerText
    } else {
        return null
    }
}

function extraerMultipleData(querySelector) {
    var array = []
    elementos = document.querySelectorAll(querySelector)
    elementos.forEach(e => {
        var elemento = e.innerText.replaceAll("\n", "-")
        array.push(elemento)
    })
    return array
}

chrome.runtime.sendMessage(json_data)
