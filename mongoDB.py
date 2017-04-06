from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017")
db = client.aba


db.polygons.insert_one({
  "type": "FeatureCollection",
  "features": [
    {
      "id": "b3bcba1547a49dae90bf2ad60f42341f",
      "type": "Feature",
      "properties": {
        "City": "Krasnyi Luch",
        "Text": "Data"
      },
      "geometry": {
        "coordinates": [
          [
            [
              38.84758251953738,
              48.31928957626155
            ],
            [
              39.18815869141969,
              48.20043416794309
            ],
            [
              39.13872021485193,
              47.788721823074866
            ],
            [
              38.432848632814284,
              47.788721823074866
            ],
            [
              38.67729443359622,
              48.28092035316115
            ],
            [
              38.84758251953738,
              48.31928957626155
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
})