const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const handleImage = (req, res, fcdb) => {
    const { id } = req.body;
    //instead of .update({entries : entries + 1}) we will use increment to increase entries number
    fcdb('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .then(data => {
        fcdb.select('entries').from('users').where('id', '=', id).limit(1)
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(`unable to get entries ${err}`))
}

const handleClarifaiCall = (req, res) => {
    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();

    // Individual App API KEY from Clarifai (Personal Access Token not working on grpc).
    metadata.set("authorization", "Key 6f6cd69f3d394f3daa19f96ed1f604d6");

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.url}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
    
            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response);
        }
    );

}

module.exports = {
    handleImage : handleImage,
    handleClarifaiCall : handleClarifaiCall
}