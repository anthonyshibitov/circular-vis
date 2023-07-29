console.log("linked");

// const audio = new Audio("blackcard.mp3");
const audio = document.getElementById("blackcard");
audio.load();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
// canvas.height = window.innerHeight;
canvas.height = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

document.getElementById("button1").addEventListener("click", () => {
  document.getElementById("button1").remove();
  audio.play();

  console.log("play");

  const audioCtx = new AudioContext();
  let audioSource = audioCtx.createMediaElementSource(audio);
  let analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount - 600;
  const dataArray = new Uint8Array(bufferLength);

  let barWidth = window.innerWidth / bufferLength;

  function animate(){
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    let lastLineTo = {x: 0, y: 0};
    for(let i = 0; i < bufferLength; i++){
      let barHeight = window.innerHeight * (dataArray[i] / 255);
      let degreeRad = (Math.PI * 2) * ( i * (1 / bufferLength));
      let centerWidth = canvas.width / 2;
      let centerHeight = canvas.height / 2;
      let xFactor = Math.cos(degreeRad);
      let yFactor = Math.sin(degreeRad);
      // let scalar = 120;
      let scalar = 150;
      let fftRatio;
      if(dataArray[i] == 0){
        fftRatio = 0;
      } else {
        fftRatio = 1 / (255 / dataArray[i]);
      }
      if(i == 0){
        ctx.moveTo(centerWidth + (xFactor * centerWidth * 0.5) + (xFactor * fftRatio * scalar), centerHeight + (yFactor * centerHeight * 0.5) + (yFactor * fftRatio * scalar));
      }
      if(i == 0){
        lastLineTo.x = centerWidth + (xFactor * centerWidth * 0.5) + (xFactor * fftRatio * scalar)
        lastLineTo.y = centerHeight + (yFactor * centerHeight * 0.5) + (yFactor * fftRatio * scalar)
      }
      if(i % 2 == 0){
        ctx.lineTo(centerWidth + (xFactor * centerWidth * 0.5) + (xFactor * fftRatio * scalar), centerHeight + (yFactor * centerHeight * 0.5) + (yFactor * fftRatio * scalar));
      }
      else {
        ctx.lineTo(centerWidth + (xFactor * centerWidth * 0.5), centerHeight + (yFactor * centerHeight * 0.5));
      }
    }
    ctx.lineTo(lastLineTo.x, lastLineTo.y);
    ctx.stroke();
    requestAnimationFrame(animate);
  }

  animate();
})