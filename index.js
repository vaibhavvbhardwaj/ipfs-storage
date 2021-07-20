const ipfsClient = require("ipfs-http-client");
const express = require("express");
//
const fileUpload = require("express-fileupload");
const fs = require("fs");

// const ipfs = new ipfsClient({host: "localhost", port: "5001", protocol: "http"})
// async function ipfsConstructor() {
//     const ipfs = await ipfsClient.create()
// }

const app = express();

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("home");
});
//
app.use(fileUpload());

//
//
//

app.post("/upload", (req, res) => {
  // console.log("req.files====>", req.files)
  // console.log("req.fileeeee====>", req)
  const file = req.files.file;
  const fileName = req.body.fileName;
  const filePath = "files/" + fileName;

  file.mv(filePath, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    const fileHash = await addFile(fileName, filePath);
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });

    res.render("upload", {fileName, fileHash})
    //  res.status(200).json({ fileHash: fileHash });
  });
});

const addFile = async (fileName, filePath) => {

  const ipfs = await ipfsClient.create({
    host: "localhost",
    port: "5001",
    protocol: "http",
  });
  
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add({ path: fileName, content: file });
  const fileHash = fileAdded.cid;
  console.log("filehash===>", fileHash);
  return fileHash;
};

app.listen(5000, () => {
  console.log("App is listening");
});
