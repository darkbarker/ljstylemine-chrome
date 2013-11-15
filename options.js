function save_options() {
	var e_defaultdo = document.getElementById("defaultdo");
	localStorage["defaultdo"] = e_defaultdo.checked;
	
	localStorage["need"] = getCheckedRadio("need");

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
};

function getCheckedRadio(name) {
    var elements = document.getElementsByName(name);
    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].value;
};

function setCheckedRadio(name, value) {
    var elements = document.getElementsByName(name);
    for (var i=0, len=elements.length; i<len; ++i)
    	elements[i].checked = elements[i].value == value;
};

function restore_options() {
	var defaultdo = localStorage["defaultdo"]; // TODO
	if (defaultdo!==undefined)
	{
		var e_defaultdo = document.getElementById("defaultdo");
		e_defaultdo.checked = (defaultdo==="true");
	}
	// need: stylemine, formatlight
	var need = localStorage["need"];
	if (need!==undefined)
	{
		setCheckedRadio("need", need);
	}
};

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
