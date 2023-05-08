function serialize_form(form) {
	return JSON.stringify(
		Array.from(new FormData(form).entries())
		.reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	);
}

function requestURLParam(sParam) {
	let sPageURL = window.location.search.substring(1);
	let sURLVariables = sPageURL.split("&");
	for (let i = 0; i < sURLVariables.length; i++) {
		let sParameterName = sURLVariables[i].split("=");
		if(sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value;
	let requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded" }
	};
	fetch(url, requestOptions)
	.then(response => response.json())
	.then(response => printItems(response))
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function printItems(respObjList) {
	let htmlStr="";
	for(let item of respObjList) {
		htmlStr+="<tr asiakas_id='rivi_"+item.asiakas_id+"'>";
		htmlStr+="<td>"+item.etunimi+"</td>";
		htmlStr+="<td>"+item.sukunimi+"</td>";
		htmlStr+="<td>"+item.puhelin+"</td>";
		htmlStr+="<td>"+item.sposti+"</td>";
		htmlStr+="<td><a href='muutaasiakas.jsp?asiakas_id="+item.asiakas_id+"'>Muuta</a>&nbsp;";
		htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi + " " + item.sukunimi)+"')>Poista</span></td>";
		htmlStr+="</tr>";	
	}
	document.getElementById("tbody").innerHTML = htmlStr;
}

function tutkiJaLisaa() {
	if(tutkiTiedot()) {
		lisaaTiedot();
	}
}

function tutkiJaPaivita() {
	if(tutkiTiedot()) {
		paivitaTiedot();
	}
}

function tutkiTiedot() {
	let ilmo="";
	if(document.getElementById("etunimi").value.length<1) {
		ilmo="Etunimi ei kelpaa!";
		document.getElementById("etunimi").focus();
	} else if (document.getElementById("sukunimi").value.length<1) {
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();
	} else if (document.getElementById("puhelin").value.length<5) {
		ilmo="Puhelinnumero ei kelpaa!";
		document.getElementById("puhelin").focus();
	} else if (document.getElementById("sposti").value.length<5) {
		ilmo="Sähköposti ei kelpaa!";
		document.getElementById("sposti").focus();
	}
	if (ilmo!="") {
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function() { document.getElementsById("ilmo").innerHTML="";}, 3000);
		return false;
	} else {
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);
		return true;
	}
}

function siivoa(teksti) {
	teksti=teksti.replace(/</g, "");
	teksti=teksti.replace(/>/g, "");
	teksti=teksti.replace(/'/g, "''");
	return teksti;
}

function lisaaTiedot() {
	let formData = serialize_form(lomake);
	let url = "asiakkaat";
	let requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=UTF-8" },
		body: formData
	};
	fetch(url, requestOptions)
	.then(response => response.json())
	.then(responseObj => {
		if (responseObj.response==0) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys epäonnistui.";
		} else if (responseObj.response==1) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys onnistui.";
			document.lomake.reset();
		}
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function varmistaPoisto(asiakas_id, sukunimi) {
	if(confirm("Poista asiakas " + decodeURI(sukunimi) +"?")) {
		poistaAuto(asiakas_id, encodeURI(sukunimi));
	}
}

function poistaAuto(asiakas_id, sukunimi) {
	let url = "asiakkaat?asiakas_id=" + asiakas_id;
	let requestOptions = {
		method: "DELETE"
	};
	fetch(url, requestOptions)
	.then(response => response.json())
	.then(responseObj => {
		if(responseObj.response==0) {
			alert("Asiakkaan poisto epäonnistui.");
		} else if(responseObj.response==1) {
			document.getElementById("rivi_" + asiakas_id).style.backgroundColor="red";
			alert("Asiakkaan " + decodeURI(sukunimi) + " poisto onnistui.");
			haeAsiakkaat();
		}
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function haeAsiakas() {
	let url = "asiakkaat?asiakas_id=" + requestURLParam("asiakas_id");
	let requestOptions = {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	};
	fetch(url, requestOptions)
	.then(response => response.json())
	.then(response => {
		document.getElementById("asiakas_id").value=response.asiakas_id;
		document.getElementById("etunimi").value=response.etunimi;
		document.getElementById("sukunimi").value=response.sukunimi;
		document.getElementById("puhelin").value=response.puhelin;
		document.getElementById("sposti").value=response.sposti;
	})
	.catch(errorText => console.error("Fetch failed: " + errorText))
}

function paivitaTiedot() {
	let formData = serialize_form(lomake);
	let url = "asiakkaat";
	let requestOptions = {
		method: "PUT",
		headers: { "Content-Type": "application/json; charset=UTF-8" },
		body: formData
	};
	fetch(url, requestOptions)
	.then(response => response.json())
	.then(responseObj => {
		if(responseObj.response==0) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan muuttaminen epäonnistui.";
		} else if (responseObj.response==1) {
			document.getElementById("ilmo").innerHTML = "Asiakkaan muuttaminen onnistui.";
			document.lomake.reset();
		}
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function asetaFocus(target) {
	document.getElementById(target).focus();
}

function tutkiKey(event, target) {
	if(event.keyCode==13) {
		if(target=="listaa") {
			haeAsiakkaat();
		} else if (target=="lisaa") {
			tutkiJaLisaa();
		} else if (target=="paivita") {
			tutkiJaPaivita();
		}
	} else if (event.keyCode==113) {
		document.location="listaaasiakkaat.jsp";
	}
}

