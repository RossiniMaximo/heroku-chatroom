import algoliasearch from "algoliasearch";

const client = algoliasearch("BO7KH091QS", "19b6229e503db83f722e1782efd9f69d");
const index = client.initIndex("products");

export { index };
