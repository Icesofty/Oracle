data = JSON.parse(blocks.toString());
console.log(data[0].Index);

var json = JSON.parse(blocks);
json.push({
  Index: 1,
  Nonce: parseInt(req.params.path),
  PreviousHash: blocks.Hash,
  Hash: " ",
  Timestamp: " "
});

fs.writeFile("results.json", JSON.stringify(json));
