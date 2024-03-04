const Clarifai = require('clarifai');

const clarifaiJSONRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'dddddd4366314e48ab070884a87e40f4';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'rif01';
  const APP_ID = 'facebrain';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
      ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };  
  // console.log(requestOptions);
  return requestOptions
}

const handleApiCall = (req, res) => {
	// HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
  // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
  // If that isn't working, then that means you will have to wait until their servers are back up. 
	// console.log(req.body.input);

	const imUrl0 = req.body.input;
    // const regions = result.outputs[0].data.regions;
	fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", 
		clarifaiJSONRequestOptions(imUrl0))
      .then(response => response.json())
    .then(result => {

        const regions = result.outputs[0].data.regions;

        const boxes = regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                // console.log(`${name}: ${value} 
                //     BBox: ${topRow}, 
                //     ${leftCol}, 
                //     ${bottomRow}, 
                //     ${rightCol}`);
                
            });
            // console.log('test regions: ', regions);
        });
        // console.log('test regions: ', regions);
        res.status(200).json(regions);

    })
    .catch(error => {
        console.log('error', error)
        return res.status(400).json('error processing the link');
    });
}


const handleImage = (req, res, db) => {
	const { id } = req.body;
	// console.log('id: ' ,id);
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			// console.log(entries);
			res.json(entries[0].entries);
		})
		.catch(err => {
			res.status(400).json('unable to get entries')
		})

}


module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}




