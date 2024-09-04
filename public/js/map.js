///////////////////////////////////////////////////
//              Geo DB For Lat & long           //
///////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {

    let geocoding = async () => {
        const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=10000&namePrefix=${city}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'dd70bd2fbfmsh6e2d5fa9ecb1859p1c49a8jsn59a7310a08cd',
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let lat = result.data[0].latitude
            let lng = result.data[0].longitude
            showMap(lat, lng)
        } catch (error) {
            console.error('Error fetching geolocation data:', error);
        }
    }

    geocoding()

    ///////////////////////////////////////////////////
    //              Display MAP                     //
    ///////////////////////////////////////////////////

    let showMap = async (latitude, longitude) => {

        var platform = new H.service.Platform({
            apikey: apikey
        });
        var defaultLayers = platform.createDefaultLayers();
        var map = new H.Map(document.getElementById('mapContainer'),
            defaultLayers.vector.normal.map,
            {
                center: { lat: 50, lng: 5 },
                zoom: 10,
                pixelRatio: window.devicePixelRatio || 1
            }
        );
        window.addEventListener('resize', () => map.getViewPort().resize());
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        var ui = H.ui.UI.createDefault(map, defaultLayers);


        var LocationOfMarker = { lat: latitude, lng: longitude };

        var pngIcon = new H.map.Icon("https://cdn4.iconfinder.com/data/icons/social-media-pins-3/32/periscope_pin_logo-128.png", { size: { w: 50, h: 50 } });

        var marker = new H.map.Marker(LocationOfMarker, { icon: pngIcon });

        map.addObject(marker);

        map.setCenter(LocationOfMarker)
        map.setZoom(11)

    }

})