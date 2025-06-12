window.onload = function () {
    var map;
    var liste_calques = {};
    var id_reseaux = new Array();
    var carte = new Object();

    // Cree les icones
    var iconeSismo = L.icon({
        iconUrl: 'sismo.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

    var iconeGNSS = L.icon({
        iconUrl: 'gnss.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

    var iconeGravi = L.icon({
        iconUrl: 'gravi.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });


    // liste des reseaux
    var liste_reseaux = {
        "Renag": ["<img src=\"./gnss.png\" style=\"width: 10; height: 10\" />&nbsp;<span style=\"font-weight: bold\">R&eacute;nag</span>", iconeGNSS]
    };


    // Fond de carte
    //fond = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {});
    fond = L.tileLayer('http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {});

    // Cree la cartes
    map = L.map('carteRenagg');
    fond.addTo(map);

    // calcule le niveau de zoom en fonction de la taille de la carte
    zoom = 3;
    if (document.getElementById('carteRenagg').offsetHeight >= 350) zoom = 4;
    if (document.getElementById('carteRenagg').offsetHeight >= 550) zoom = 5;
    if (document.getElementById('carteRenagg').offsetHeight >= 750) zoom = 6;
    map.setView([47, 2.5], zoom);

    var liste_calques = {};
    var legende = L.control.layers();

    for (var key in liste_reseaux) id_reseaux.push(key);

    var i = 0;
    id_reseaux.forEach(function (id_reseau) {

        carte[liste_reseaux[id_reseau][0]] = "";

        // calques de chaque reseau de stations 
        console.log(id_reseau + "....");
        var iconeStation = liste_reseaux[id_reseau][1]
        $.getJSON("./reseaux_json/stations.geojson", function(data) {
            carte_tmp = L.geoJson(data, {
                pointToLayer: function(Feature,latlng){
                    var marker = L.marker(latlng, {icon: iconeStation});
                    nom = "";
                    reseau = "";
                    agence = "";
                    lieu = "";
                    rtk = "";
                    url = "";
                    en_service_depuis = "";
                    if (Feature.properties.Nom) nom = Feature.properties.Nom;
                    if (Feature.properties.Reseau) reseau = Feature.properties.Reseau;
                    if (Feature.properties.Agence) agence = Feature.properties.Agence;
                    if (Feature.properties.Lieu) lieu = Feature.properties.Lieu;
                    if (Feature.properties.RTK) rtk = Feature.properties.RTK;
                    if (Feature.properties.URL) url = Feature.properties.URL;
                    if (Feature.properties.En_service_depuis_le) en_service_depuis = Feature.properties.En_service_depuis_le;
                    var txt = "Nom : " + nom + "<br/>Reseau : " + reseau + "<br/>Agence : " + agence + "<br/>Lieu : " + lieu + "<br/>RTK : " + rtk + "<br/>URL : <a href=\"" + url + "\">" + url + "</a><br/>En service depuis le : " + en_service_depuis;

                    marker.bindPopup(txt);
                    return marker;
                }
            });
        }).done(function () {
            reseau = liste_reseaux[id_reseau][0];
            carte[reseau] = carte_tmp;
            map.addLayer(carte[reseau]);
        });
    });
}
