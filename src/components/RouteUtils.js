
export function sendRequest(waypoint, callback) {

        //console.log(waypoint);
        const directionService = new window.google.maps.DirectionsService();
        const len = waypoint.length;
        const origin = { lat: waypoint[0].geometry.location.lat, lng: waypoint[0].geometry.location.lng };
        const destination = {lat: waypoint[len-1].geometry.location.lat,lng: waypoint[len-1].geometry.location.lng};
        const waypoints = [];
        if(len > 2) {
            for(let i=1; i < len-1; i++) {
                waypoints.push({location: {lat: waypoint[i].geometry.location.lat, lng: waypoint[i].geometry.location.lng}});
            }
        }
        
        let request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING',
            waypoints: waypoints
        };
        
        directionService.route(request, (response, status) => {
            //console.log(response);
            if (status === 'OK') {
                callback(response);
            } else {
                console.log(status);
            }
        });
    }

// The following two values must be different to work properly!

// Used to set zoom level before show routes on map.
export const zoomBefore = 11;

// Used to set zoom level after show routes on map.
export const zoomAfter = 12;