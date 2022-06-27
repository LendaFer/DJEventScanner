//Hardcoded example people
const data = [
    {person:{
        name: "Nils Folkerts",
        company: "CGI"
    }},
    {person:{
        name: "Matthias Folkerts",
        company: "CGI"
    }},
    {person:{
        name: "Carsten Müller",
        company: "HHU"
    }},
    {person:{
        name: "Albert Einstein",
        company: "Long Complicated Company Name"
    }},
    {person:{
        name: "Simone de Beauvoir",
        company: "Philosophy"
    }},
    {person:{
        name: "Mandelbrot",
        company: "Mathematic"
    }}
]

const names = data.map(obj => obj.person.name)
const companys = data.map(obj => obj.person.company)



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

//backButton
const backButton = document.createElement("button")
backButton.setAttribute("class", "btn btn-primary")
backButton.setAttribute("id", "back-button")

//buildStartPage
const cameraCanvas = document.createElement("div")
cameraCanvas.setAttribute("class", "canvas bg-secondary")
cameraCanvas.setAttribute("id", "camera-canvas")
const scanButton = document.createElement("button")
scanButton.setAttribute("class", "btn btn-primary")
scanButton.setAttribute("id", "scan-button")

//const for video
const marginX = 10;
const marginY = 50;
const width = 500;
const height = 400; 

let testNum = 0;

//globals
let scanning = false;

//containers
const containerBottom = document.getElementById("container-bottom");
const containerCamera = document.getElementById("container-camera")
let currentBooth = document.getElementById("dropdown-button").innerText;

//worker
const worker = Tesseract.createWorker();

//hardcoded in this example -> normally known from backend
const numberOfBooths = 10;
const boothButtons = document.querySelectorAll(".booth-button");

for(let i = 0; i < boothButtons.length; i++){
    boothButtons[i].addEventListener("click", ()=>{
        currentBooth = boothButtons[i].innerText;
        document.getElementById("dropdown-button").innerText = currentBooth;
    })
}

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

backButton.addEventListener("click", async ()=>{
    scanning = false;
    buildStartPage()
})

const buildStartPage = () => {
    containerBottom.innerHTML = "";
    containerCamera.innerHTML = "";
    longCol.innerHTML = "";
    testNum = 0;
    containerCamera.appendChild(cameraCanvas);
    containerBottom.appendChild(scanButton);
    scanButton.innerText = "Start Scan"

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
    canvas.height = video.offsetHeight;
    canvas.width = video.offsetWidth;
    //canvas.getContext("2d").drawImage(video, marginX, marginY, canvas.width-2*marginX, canvas.height-marginY, 0, 0, 500, 400)
    canvas.getContext("2d").drawImage(video, 0, 0)
    // irgendein try and catch ding damit nicht immer fehlermeldungen kommen!
    const { data: { lines } } = await worker.recognize(canvas);
    testText(lines);
    if(scanning){
        containerBottom.appendChild(canvas)
        requestAnimationFrame(tick(video));
    }else{
        scanned(text)
    }
    
}

const scanned = (lines) => {
    longCol.innerHTML = "<p id=name>Nils Folkerts</p> <p id=company>CGI</p>"
    colCenter.innerHTML = ""
    backButton.innerText = "Back"
    containerBottom.appendChild(backButton)
}

const testText = async (lines) => {
    const line1 = lines[0].text
    const name = line1.substring(0, line1.length-1)
    const line2 = lines[1].text
    const company = line2.substring(0, line2.length-1)
    console.log(line1)
    if(names.includes(name)){
        console.log(name)
        console.log(company)
        if(companys[names.indexOf(name)] == company){
            alert(name)
            scanning = false;
            console.log("TeST")
        }        
    }
}

buildStartPage()