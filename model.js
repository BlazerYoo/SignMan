let video = document.getElementById('cameraStream');

// Load trained model
let sess = new onnx.InferenceSession();
let loadingModelPromise = sess.loadModel('signman_coordinate_model.onnx');

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const constraints = {
      video: true
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        video.srcObject = stream;
        video.addEventListener('loadeddata', () => {
          resolve(video);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function loadModel() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
    // or 'base/node_modules/@mediapipe/hands' in npm.
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);
  return detector;
}

function argmax(array) {
  return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function indexToLetter(index) {
  indexDict = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
    8: 'i',
    9: 'k',
    10: 'l',
    11: 'm',
    12: 'n',
    13: 'o',
    14: 'p',
    15: 'q',
    16: 'r',
    17: 's',
    18: 't',
    19: 'u',
    20: 'v',
    21: 'w',
    22: 'x',
    23: 'y'
  }
  return indexDict[index];
}

async function getHands() {

  const detector = await loadModel();



  async function predict() {
    const estimationConfig = { flipHorizontal: false };
    const hands = await detector.estimateHands(video, estimationConfig);

    // If hand is detected
    if (hands.length > 0) {

      // Extract x y coordinates as array
      const handKeypoints = hands[0].keypoints3D;
      const keypointsArr = new Array();
      handKeypoints.map((coord) => {
        keypointsArr.push(coord.x);
        keypointsArr.push(coord.y);
      });

      const input = new onnx.Tensor(new Float32Array(keypointsArr), 'float32', [1, 42]);

      const outputMap = await sess.run([input]);
      const outputTensor = outputMap.values().next().value;
      const predictions = outputTensor.data;

      const letterIndex = argmax(predictions);
      const letter = indexToLetter(letterIndex);
      console.log(letter);

      document.getElementById('letter-container').innerText = letter;

    } else {
      document.getElementById('letter-container').innerText = '';
    }

    requestAnimationFrame(predict);
  }

  predict();
}




function main() {
  loadingModelPromise.then(async () => {
    await setupWebcam();
    getHands();
  });
}

main()