const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(comenzarVideo)


function comenzarVideo(){
  navigator.getUserMedia(
      {video: {} },
      stream => video.srcObject = stream,
      err => console.log(err)
  )
}

video.addEventListener('play', ()=>{
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const tamanioPantalla = { width:video.width, height:video.height }
  faceapi.matchDimensions(canvas, tamanioPantalla)
  setInterval(async () => {
    const deteccion = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    console.log('cantidad:',deteccion)
    const detectarRedimensionar = faceapi.resizeResults(deteccion, tamanioPantalla)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, detectarRedimensionar)
    faceapi.draw.drawFaceLandmarks(canvas, detectarRedimensionar)
    faceapi.draw.drawFaceExpressions(canvas, detectarRedimensionar)
  }, 100)
})
 