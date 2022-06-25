//NameContainer
const textCard = document.createElement("div")
textCard.setAttribute("class", "card")
const textCardBody = document.createElement("div")
textCardBody.setAttribute("class", "card-body")
const textCardText = document.createElement("div")
textCardText.setAttribute("class", "card-text")
const row = document.createElement("div")
row.setAttribute("class", "row")
const longCol = document.createElement("div")
longCol.setAttribute("class", "col-8")
const colCenter = document.createElement("div")
colCenter.setAttribute("class", "col align-self-center")
const spinner = document.createElement("div")
spinner.setAttribute("class", "spinner-border text-secondary text-center")
const placeholderShimmer = document.createElement("div")
placeholderShimmer.setAttribute("class", "placeholder shimmer")
const fauxText = document.createElement("div")
fauxText.setAttribute("class", "faux-text")
const fauxTextShort = document.createElement("div")
fauxTextShort.setAttribute("class", "faux-text short")


//globals
let scanning = false;

//containers
const containerBottom = document.getElementById("container-bottom");

let currentBooth = document.getElementById("dropdown-button").innerText;

//worker
const worker = Tesseract.createWorker();

//video


//hardcoded in this example -> normally known from backend
const numberOfBooths = 10;
const boothButtons = document.querySelectorAll(".booth-button");

for(let i = 0; i < boothButtons.length; i++){
    boothButtons[i].addEventListener("click", ()=>{
        currentBooth = boothButtons[i].innerText;
        document.getElementById("dropdown-button").innerText = currentBooth;
    })
}


//scan-button
const scanButton = document.getElementById("scan-button");
//camera-card
const cameraCard = document.getElementById("camera-canvas");

scanButton.addEventListener("click", async ()=>{
    startScanning()
    startLoadingCard()
})

function newContext({width, height}, contextType = '2d') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext(contextType);
}




const startScanning = async () => {
    scanning = true;
    
    document.getElementById("container-camera").innerHTML="<video autoplay playsinline id=camera-video></video>";
    const video = document.getElementById("camera-video")
    const stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: "environment", allowCrop: "true", height: 200, width: 200},audio: false})
    video.srcObject = stream
    
    await worker.load()
    await worker.loadLanguage("deu")
    await worker.initialize("deu")
    requestAnimationFrame(tick(video))
}


const startLoadingCard = async () =>{
    // containerBottom.innerHTML = "<div class=card> <div class=card-body> <div class=card-text><div class=row row-cols-2> <div class=col-8><div class=placeholder shimmer><div class=faux-text></div><div class=faux-text short></div></div></div><div class=col align-self-center><div class=spinner-border></div></div></div></div></div></div>"
    containerBottom.innerHTML = ""
    containerBottom.appendChild(textCard)
    textCard.appendChild(textCardBody)
    textCardBody.appendChild(textCardText)
    textCardText.appendChild(row)
    row.appendChild(longCol)
    row.appendChild(colCenter)
    longCol.appendChild(placeholderShimmer)
    placeholderShimmer.appendChild(fauxText)
    placeholderShimmer.appendChild(fauxTextShort)
    colCenter.appendChild(spinner)   
}

const tick = async (video) => {
    const canvas = document.createElement("canvas")
    canvas.height = 200;
    canvas.width = 200;
    canvas.getContext("2d").drawImage(video, 0, 0)
    // irgendein try and catch ding damit nicht immer fehlermeldungen kommen!
    const { data: { text } } = await worker.recognize(canvas);
    testText(text);
    scanned()
    if(scanning){
        requestAnimationFrame(tick(video));
    }else{
        scanned(text)
    }
    
}

const scanned = async (text) => {
    console.log("Test")
    longCol.innerHTML = "<p>Nils Folkerts </p> <p>CGI</p>"
    colCenter.innerHTML = ""
}

const testText = async (text) => {
}

