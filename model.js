let video = document.getElementById('cameraStream');

// Load trained model
const sess = new onnx.InferenceSession();
const loadingModelPromise = sess.loadModel('signman_model.onnx');

function setupWebcam() {
  // Accessing the user camera and video.
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      // Changing the source of video to current stream.
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    })
    .catch(alert);
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
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'K',
    10: 'L',
    11: 'M',
    12: 'N',
    13: 'O',
    14: 'P',
    15: 'Q',
    16: 'R',
    17: 'S',
    18: 'T',
    19: 'U',
    20: 'V',
    21: 'W',
    22: 'X',
    23: 'Y'
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

      const input = new onnx.Tensor(new Float32Array(keypointsArr), 'float32', [1, 3, 224, 224]);

      const outputMap = await sess.run([input]);
      const outputTensor = outputMap.values().next().value;
      const predictions = outputTensor.data;

      const letterIndex = argmax(predictions);
      const letter = indexToLetter(letterIndex);
      console.log(letter);


    }

    requestAnimationFrame(predict);
  }

  predict();
}




setupWebcam();
getHands();