const processor = {};

processor.doLoad = function doLoad() {
  // manipulate video
  const video = document.getElementById("video");
  video.setAttribute("width", 1200);
  this.video = video;

  this.c1 = document.createElement("canvas");
  this.c1.setAttribute("width", 1280);
  this.c1.setAttribute("height", 720);
  this.ctx1 = this.c1.getContext("2d");

  this.c2 = document.getElementById("c2");
  this.ctx2 = this.c2.getContext("2d");

  video.addEventListener(
    "play",
    () => {
      this.width = video.videoWidth;
      this.height = video.videoHeight;
      this.timerCallback();
    },
    false
  );

  // setup face detection
  this.faceDetection = new FaceDetection({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.0/${file}`;
    },
  });
  this.faceDetection.setOptions({
    minDetectionConfidence: 0.55,
  });
  this.faceDetection.onResults(this.handleResults);
};

processor.timerCallback = function timerCallback() {
  if (this.video.paused || this.video.ended) {
    return;
  }
  this.computeFrame();
  setTimeout(() => {
    this.timerCallback();
  }, 0);
};

processor.handleResults = function handleResults(results) {
  debugger;
  // Draw the overlays.
  this.ctx2.save();
  this.ctx2.clearRect(0, 0, this.c2.width, this.c2.height);
  this.ctx2.drawImage(results.image, 0, 0, this.c2.width, this.c2.height);

  if (results.detections.length > 0) {
    this.ctx2.filter = "blur(4px)";
    results.detections[0].boundingBox.height =
      results.detections[0].boundingBox.height + 0.03;
    results.detections[0].boundingBox.width =
      results.detections[0].boundingBox.width + 0.03;
    drawRectangle(this.ctx2, results.detections[0].boundingBox, {
      fillColor: "#c8c8c8",
    });

    // draw landmarks
    // drawLandmarks(this.ctx2, results.detections[0].landmarks, {
    //   color: "red",
    //   radius: 5,
    // });
  }
  this.ctx2.restore();
};

processor.computeFrame = function computeFrame() {
  this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
  const frame = this.ctx1.getImageData(0, 0, this.width, this.height);

  debugger;
  this.faceDetection
    .send({ image: frame.data })
    .then((data) => {
      debugger;
    })
    .catch((err) => {
      debugger;
    });

  // const length = frame.data.length;

  // for (let i = 0; i < length; i += 4) {
  //   const red = frame.data[i + 0];
  //   const green = frame.data[i + 1];
  //   const blue = frame.data[i + 2];
  //   if (green > 100 && red > 100 && blue < 43) {
  //     frame.data[i + 3] = 0;
  //   }
  // }
  // this.ctx2.putImageData(frame, 0, 0);
};

// load
processor.doLoad();
