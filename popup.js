'use strict';

var infojobsURL = "https://www.infojobs.net/candidate/cv/view/index.xhtml" //TODO: cambiar a url de cvs
var linkedInURL = "https://www.linkedin.com/in/" //TODO: cambiar a url de cvs
var retrievedLinkedin = {
    contactInfo: false,
    generalInfo: false,
    experience: false
}
let url = ""

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
        .catch(error => console.error('Error:', error))
        .then(response => {
            var url = new URL('http://127.0.0.1:8085/candidatos/report?email=' + json_data.datosExtraidos.email + '&platform=' + json_data.datosExtraidos.sitioWeb);
            fetch(url, {
                method: 'GET',
                // mode: 'no-cors'
            }).catch(error => console.log("Error:" + error))
                .then(async res => ({
                    blob: await res.blob(),
                    contentType: res.headers.get("content-type"),
                   
                })).then(resObj => {
                    
                    let body = new Blob([resObj.blob], { type: resObj.contentType })
                    let objectURL = URL.createObjectURL(body);
                    chrome.downloads.download({ url: objectURL, filename: (json_data.datosExtraidos.nombre + ".pdf"), conflictAction: 'overwrite' })
                });
        });

})
