package travelplanner.rpc;

import org.springframework.http.ResponseEntity;
import travelplanner.model.*;
import org.springframework.web.client.RestTemplate;
import travelplanner.Const;

/**
 * this class calls Google Map API for city and tourist attractions data
 *
 */
public class GoogleMapClient {
    private static final String KEY = Const.KEY;
    private static final String TYPE = "tourist_attraction";
    private static final int LIMIT = 60;

    private static final String FIND_PLACE_URL =
           Const.FIND_PLACE_BASE_URL + "input=%s&inputtype=textquery&fields=geometry,name&key=%s";

    private static final String NEARBY_SEARCH_URL =
    	   Const.NEARBY_SEARCH_BASE_URL + "location=%s,%s&radius=%s&type=%s&key=%s";

    private static final String PLACE_DETAIL_SEARCH_URL =
           Const.PLACE_DETAIL_SEARCH_BASE_URL + "place_id=%s&key=%s";

//    private static final String DESCRIPTION_URL =
//            Const.DESCRIPTION_BASE_URL + "titles=%s";

    private static final String PHOTO_URL =
            Const.PHOTO_BASE_URL + "photoreference=%s&key=%s";

    private RestTemplate restTemplate;

    public GoogleMapClient() {
        restTemplate = new RestTemplate();
    }

    /**
     * @param city
     * @return the tourist attractions which are stored in an AttractionsResult object.
     * The main logic is in the overloaded function below. In this method, we get the
     * coordinates of center and calculate for radius which are required by the overloaded
     * method.
     */
    public AttractionsResult getAttractionsResult(String city) {
        PlaceInfo placeInfo = getPlaceInfo(city);
        Geometry geometry = placeInfo.getCandidates()[0].getGeometry();
        String cityName = placeInfo.getCandidates()[0].getName();

        double centerLat = geometry.getLocation().getLat();
        double centerLng = geometry.getLocation().getLng();

        double northEastLat = geometry.getViewport().getNortheast().getLat();
        double northEastLng = geometry.getViewport().getNortheast().getLng();

        double southWestLat = geometry.getViewport().getSouthwest().getLat();
        double southWestLng = geometry.getViewport().getSouthwest().getLng();

        int dist1 = calcDist(centerLat, centerLng, northEastLat, northEastLng);
        int dist2 = calcDist(centerLat, centerLng, southWestLat, southWestLng);

        int radius = (dist1 + dist2) / 2;

        return getAttractionsResult(cityName, centerLat, centerLng, radius);
    }

    /**
     * @param city
     * @return the geometry of the city, including center/northeast/southwest coordinates.
     * Attention, there may be several candidates, we only return the first one, if any
     * else return null.
     */
    private PlaceInfo getPlaceInfo(String city) {
        String url = String.format(FIND_PLACE_URL, city, KEY);
        System.out.println(url);
        PlaceInfo res = restTemplate.getForObject(url, PlaceInfo.class);
        PlaceInfo.Candidate[] candidates = res.getCandidates();
        if (candidates.length == 0) return null;
        return res;
    }

    // TODO this function should be re-implemented
    /**
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @return the spherical distance between two coordinates
     */
    private int calcDist(double lat1, double lng1, double lat2, double lng2) {
        return 20000;
    }

    
    /**
     * @param lat: latitude of the center of the city
     * @param lng: longitude of the center of the city
     * @param radius: radius of the city
     * @return the tourist attractions in the city which are stored in the AttractionResult
     * object
     */
    private AttractionsResult getAttractionsResult(String cityName, double lat, double lng, int radius) {
        String url = String.format(NEARBY_SEARCH_URL, lat, lng, radius, TYPE, KEY);
        System.out.println("calling: " + url);
        AttractionsResult res = restTemplate.getForObject(url, AttractionsResult.class);
        res.setCityName(cityName);
        res.setCoordinate(new double[] {lat, lng});
        return res;
    }

    /**
     * @param place_id: this info is returned by Google Map API for each 
     * tourist attraction stored in AttractionsResult
     * @return the detail information of a tourist attractions, which is 
     * stored in an AttractionDetail object
     */
    public AttractionDetail getPlaceDetailResult(String place_id) {
        String url = String.format(PLACE_DETAIL_SEARCH_URL, place_id, KEY);
        System.out.println("calling: " + url);
        AttractionDetail detail = restTemplate.getForObject(url, AttractionDetail.class);
        AttractionDetail.Photo[] photos = detail.getResult().getPhotos();
        if (photos != null) {
            for (AttractionDetail.Photo photo : photos) {
                photo.setPhoto_reference(String.format(PHOTO_URL, photo.getPhoto_reference(), KEY));
            }
        }
        String priceLevel = detail.getResult().getPrice_level();
        if (priceLevel != null) {
            switch (priceLevel) {
                case "0":
                    detail.getResult().setPrice_level("Free");
                    break;
                case "1":
                    detail.getResult().setPrice_level("Inexpensive");
                    break;
                case "2":
                    detail.getResult().setPrice_level("Moderate");
                    break;
                case "3":
                    detail.getResult().setPrice_level("Expensive");
                    break;
                case "4":
                    detail.getResult().setPrice_level("Very Expensive\n");
                    break;
            }
        }
        return detail;
    }


//    public String getDescription(String city) {
//        String url = String.format(DESCRIPTION_URL, city);
//        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
//        System.out.println(responseEntity.getStatusCode());
//
//        String body = responseEntity.getBody();
//        System.out.println(body);
//
//        int index = body.indexOf("\"extract\":\"");
//        int dotIndex = body.indexOf(".", index);
//        return body.substring(index, dotIndex + 1);
//    }
}


