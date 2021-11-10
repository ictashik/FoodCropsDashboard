(function ($) {

	$.fn.choropleth_map = function(){

		return this.each(function() {

      var $el = jQuery( this );

      // CREATE ELEMENTS ON THE FLY
      function createElements(){

        var $loader = jQuery( document.createElement( 'div' ) );
        $loader.addClass( 'loader' );
        $loader.html( "<h3 class='loadtext'><i class='fa fa-spinner fa-spin'></i> Loading data, please wait..</h3>" );
        $loader.appendTo( $el );

        var $map = jQuery( document.createElement( 'div' ) );
        $map.attr('id', 'map');
        $map.appendTo( $el );

       

      }

      function drawMap(){

        // HIDE THE LOADER
        $el.find('.loader').hide();

        //SETUP BASEMAP
        var map = L.map('map').setView( [22.27, 80.37], 5 );

        //var hybUrl='https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3VuZWV0bmFydWxhIiwiYSI6IldYQUNyd0UifQ.EtQC56soqWJ-KBQqHwcpuw';
       
        //ADD DISTRICT BOUNDARIES
        var gjLayerDist = L.geoJson( geodist, { style: styledist, onEachFeature: onEachDist } );
        gjLayerDist.addTo(map);

        //ADD STATE BOUNDARIES
        var statelines = {
          "color":"#000",
          "weight":1,
          "opacity":1,
          "fill":false
        };

        var gjLayerStates = L.geoJson( geoStates, { style: statelines } );
        gjLayerStates.addTo(map);
      }

      function popContent( feature ) {
        //FOR DISTRICT POP UPS ON CLICK
        for ( var i = 0; i<data.length; i++ ){
          if ( data[i]["District"] == feature.properties["DISTRICT"] ) {
            return '<h4>'+data[i]["District"]+'</h4><p> '+ data[i]["Number-of-Reports"] + ' Tonnes</p>';
          }
        }
      }

      function styledist( feature ) {

        //CHOROPLETH COLORS BASED ON RANGE ONLY
        var color = "#ecf0f1";

        for (var i = 0;i<data.length;i++){
          if (data[i]["District"] == feature.properties["DISTRICT"]) {
            if (data[i]["Number-of-Reports"] > 750) color = "#c0392b";
            else if (data[i]["Number-of-Reports"] >= 500 && data[i]["Number-of-Reports"] <=750) color = "#e67e22";
            else if (data[i]["Number-of-Reports"] >= 2500 && data[i]["Number-of-Reports"] <= 500) color = "#2ecc71";
            else if (data[i]["Number-of-Reports"] < 250) color = "#1abc9c";
            else color = "#3498db";
          }
        }
        return {
          fillColor: color,
          weight: 1,
          opacity: 0.4,
          color: 'black',
          dashArray: '1',
          fillOpacity: 0.8
        };
      }

      function onEachDist( feature, layer ) {
        //CONNECTING TOOLTIP AND POPUPS TO DISTRICTS
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          //click: zoomToFeature
        });
        layer.bindTooltip( feature.properties.DISTRICT + ', ' + feature.properties.ST_NM, {
          direction : 'auto',
          className : 'statelabel',
          permanent : false,
          sticky    : true
        } );
        layer.bindPopup(popContent(feature), {maxWidth:800});
      }

      function highlightFeature(e) {
        //DISTRICT HIGHLIGHT ON MOUSEOVER
        var layer = e.target;

        layer.setStyle( {
          weight: 3,
          color: 'black',
          opacity: 0.9
        } );
        if ( !L.Browser.ie && !L.Browser.opera ) {
          layer.bringToFront();
        }
      }

      function resetHighlight(e) {
          //RESET HIGHLIGHT ON MOUSEOUT
          var layer = e.target;
          layer.setStyle({
            weight: 1,
            color: 'black',
            opacity: 0.4
          });
      }

      function zoomToFeature(e) {
        // PROBABLY THE MAP VARIABLE NEEDS TO BE A GLOBAL VARIABLE HERE
        map.fitBounds(e.target.getBounds());
      }

      // INITIALIZE FUNCTION
      function init(){

        // CREATE ALL THE DOM ELEMENTS FIRST
        createElements();

        // RENDER THE MAP IN THE CORRECT DOM
        drawMap();
      }

      init();

    });
  };
}(jQuery));

jQuery(document).ready(function(){

  jQuery( '[data-behaviour~=choropleth-map]' ).choropleth_map();
  console.log('logged mmap');

});
