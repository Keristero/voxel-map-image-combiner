const { createCanvas, loadImage } = require('canvas')
const path = require('path');
const fs = require('fs')

const targetFolder = process.argv[2];
console.log(`Target folder = ${targetFolder}`)
const regionSize = 256

function difference(valA,valB){
    return Math.max(valA,valB) - Math.min(valA,valB)
}

fs.readdir(targetFolder, async(err, files) => {
    if(err){
        console.log(`Error: ${err}`)
    }
    let MinX = Infinity
    let MaxX = -Infinity
    let MinY = Infinity
    let MaxY = -Infinity
    for(let fileName of files){
        //Determine min and max (edge) region coordinates
        let regionCoords = fileName.split(",")
        let x = parseInt(regionCoords[0])
        let y = parseInt(regionCoords[1])
        if(x > MaxX){
            MaxX = x
        }
        if(x < MinX){
            MinX = x
        }
        if(x > MaxY){
            MaxY = x
        }
        if(x < MinY){
            MinY = x
        }
    };
    console.log(`Located edge regions, FirstX = ${MinX}, LastX = ${MaxX}, FirstY = ${MinY} LastY = ${MaxY}`)
    let baseX = MinX * -1
    let baseY = MinY * -1
    let width = difference(MinX,MaxX)*regionSize
    let height = difference(MinY,MaxY)*regionSize
    console.log(`Creating canvas with width = ${width}, height = ${height}`)
    let canvas = createCanvas(width,height)
    let ctx = canvas.getContext('2d')

    //Loop through each image file, load it, and draw it to the canvas
    for(let fileName of files){
        //Get path to file
        let filePath = path.join(targetFolder,fileName)
        //Load image
        let image = await loadImage(filePath)
        //Find region coordinates from the filename
        let regionCoords = fileName.split(",")
        let x = parseInt(regionCoords[0])
        let y = parseInt(regionCoords[1])
        //Draw image to canvas
        ctx.drawImage(image, (baseX+x)*regionSize, (baseY+y)*regionSize, regionSize, regionSize)
        console.log("drew",fileName)
    };

    //Save PNG file
    const out = fs.createWriteStream(path.join(process.execPath,"..",'/output.png'))
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log('The PNG file was created.'))
})