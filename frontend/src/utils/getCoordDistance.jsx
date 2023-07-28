const getCoordDistance = (userData, data) => {
  const calculateDistance = (petLocation) => {
    if (!userData.location) {
      return -1;
    } else {
      let lat1 = userData.location.latitude;
      let lon1 = userData.location.longitude;
      let lat2 = petLocation.latitude;
      let lon2 = petLocation.longitude;

      let dLat = ((lat2 - lat1) * Math.PI) / 180.0;
      let dLon = ((lon2 - lon1) * Math.PI) / 180.0;

      lat1 = (lat1 * Math.PI) / 180.0;
      lat2 = (lat2 * Math.PI) / 180.0;

      let a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
      let rad = 6371;
      let c = 2 * Math.asin(Math.sqrt(a));

      return rad * c;
    }
  };

  for (let i = 0; i < data.length; i++) {
    let distance = calculateDistance(data[i].location);
    data[i].distance = Math.round(distance);
  }

  return data;
};

export default getCoordDistance;
