import * as express from "express";
import * as cors from "cors";
import { index } from "../lib";
import { Comerce } from "../db/comerce";
const API_URL = "http://localhost:3001";
const app = express();

const port = process.env.PORT || 3001;
app.use(express.json());

app.get("/comerces", async (req, res) => {
  const comerces = await Comerce.findAll();
  res.json(comerces);
});

app.get("/comerces/:id", async (req, res) => {
  const comerce = await Comerce.findByPk(req.params.id);
  res.json(comerce);
});

/* function hitsSimplifier(body) {
  const res: any = {};
  body.forEach((e) => {
    res.name = e.name;
    res.area = e.area;
    res.objectID = e.objectID;
    res.lat = e._geoloc.lat;
    res.lng = e._geoloc.lng;
  });
  // console.log("soy res:", res);
  return res;
} */

app.get("/nearby-comerces", async (req, res) => {
  const { lat, lng } = req.query;
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000,
  });
  console.log(hits);
  res.json(hits);
});

app.post("/comerce", async (req, res) => {
  const newComerce = await Comerce.create(req.body);
  const saveInAlgolia = await index.saveObject({
    objectID: newComerce.get("id"),
    name: newComerce.get("name"),
    area: newComerce.get("area"),
    _geoloc: {
      lat: newComerce.get("lat"),
      lng: newComerce.get("lng"),
    },
  });
  res.json(newComerce);
});

function indexsBody(body, id?) {
  const { name, area, lat, lng } = body;
  const response: any = {};
  if (name) {
    response.name = name;
  }
  if (area) {
    response.area = area;
  }
  if (lat && lng) {
    response._geoloc = { lat, lng };
  }
  if (id) {
    response.objectID = id;
  }
  const result = JSON.parse(response);
  console.log(result);

  return result;
}

app.put("/comerces/:id", async (req, res) => {
  const comerce = await Comerce.update(req.body, {
    where: { id: req.params.id },
  });
  const indexItems = indexsBody(req.body, req.params.id);
  console.log(indexItems);

  const saveInAlgolia = await index.partialUpdateObject(indexItems);
  console.log(saveInAlgolia);

  res.json(comerce);
});

app.delete("/comerces/:id", async (req, res) => {
  const comerce = await Comerce.findByPk(req.params.id);
  comerce.destroy();
});
app.use(express.static("public"));

app.listen(port, () => {
  console.log("El servidor esta corriendo de manera exitosa", port);
});
