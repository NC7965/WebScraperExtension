'use strict';

var infojobsURL = "https://www.infojobs.net/candidate/cv/view/index.xhtml" //TODO: cambiar a url de cvs
var linkedInURL = "https://www.linkedin.com/in/" //TODO: cambiar a url de cvs
var retrievedLinkedin = {
    contactInfo: false,
    generalInfo: false,
    experience: false
}
let url = ""
checkDedaloKeyAvailability()

function checkDedaloKeyAvailability() {
    chrome.storage.local.get(['DedaloKey'], function (result) {
        if(result.DedaloKey == undefined) {
            document.getElementById("GetDataButtonDiv").style.display="none"
            document.getElementById("FormDedaloKeyDiv").style.display= "contents"
        } else {
            document.getElementById("FormDedaloKeyDiv").style.display= "none"
            document.getElementById("GetDataButtonDiv").style.display="contents"
        }
    })
}

storeDedaloKey.onclick = function storeDedaloKey() {
    var DedaloKey = document.getElementById("DedaloKey").value
    chrome.storage.local.set({'DedaloKey': DedaloKey})
    checkDedaloKeyAvailability()
}

getData.onclick = async function getData() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        url = tabs[0].url
        let idTab = tabs[0].id
        if (url.includes(infojobsURL)) {
            chrome.scripting.executeScript({ target: { tabId: idTab }, files: ['scriptInfojobs.js'] })
        } else if (url.includes(linkedInURL)) {
            chrome.scripting.executeScript({ target: { tabId: idTab }, files: ['scriptLinkedin.js'] })
            promiseTab = chrome.tabs.create({ active: false, url: url + '/overlay/contact-info/' })
            chrome.scripting.executeScript({ target: { tabId: promiseTab }, files: ['scriptGetContactInfoLinkedin.js'] })
        } else {
            alert("No se ha encontrado scrapper para la url " + url)
        }
    })
}



chrome.runtime.onMessage.addListener(function getCVInfo(json_data) {
    //let blob = new Blob([JSON.stringify(json_data.datosExtraidos)], { type: "application/json;charset=utf-8" });
    //let objectURL = URL.createObjectURL(blob);
    //chrome.downloads.download({url: objectURL, filename: ('content/cv.json'), conflictAction: 'overwrite'})


    //Post
    var urlsave = new URL('http://127.0.0.1:8085/candidatos/');

    fetch(urlsave, {
        method: 'POST',
        // mode: 'no-cors',
        body: JSON.stringify(json_data.datosExtraidos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .catch(error => { 
            alert("Ha ocurrido un error al conectar con el servidor")
            console.error('Error:', error) })
        .then(response => {
            if(response.ok) {
                solicitarCV(json_data)
            } else {
                alert("Ha ocurrido un error al intentar almacenar el CV en la base de datos")
            }
        });
    
    
})
function solicitarCV(json_data) {
    var url = new URL('http://127.0.0.1:8085/candidatos/report?email=' + json_data.datosExtraidos.email + '&platform=' + json_data.datosExtraidos.sitioWeb);
    fetch(url, {
        method: 'GET',
        // mode: 'no-cors'
    }).catch(error => { 
        alert("Ha ocurrido un error al conectar con el servidor")
        console.error('Error:', error) }
        )
        .then(async res => { 
            if(res.ok) {
                return {errorRes: false, resObj: ({
                    blob: await res.blob(),
                    contentType: res.headers.get("content-type"),
                })}
            } else {
                return {errorRes:true, resObj: null}
            }
            }).then(data => {
                if(data.errorRes == true) {
                    alert("Ha ocurrido un error al solicitar CV al servidor")
                } else {
                    let body = new Blob([data.resObj.blob], { type: data.resObj.contentType })
                    let objectURL = URL.createObjectURL(body);
                    chrome.downloads.download({ url: objectURL, filename: (json_data.datosExtraidos.nombre + ".pdf"), conflictAction: 'overwrite' })
                }
        });
}