import path from "path";
import DataURIParser from "datauri/parser.js"; // This is the preferred way to import parser

const parser = new DataURIParser(); // Instantiate the parser

const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
