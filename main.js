const { createCanvas, loadImage ,screenshotCanvas} = require('puppet-canvas')
const path = require('path');
const fs = require('fs')
const imageDataURI = require('image-data-uri')

let targetFolder = null
if(process.argv[2]){
    targetFolder = process.argv[2];
    console.log(`Target folder = ${targetFolder}`)
}else{
    console.error(`please provide the path to your voxelmap image output folder (..\\z1)`)
}
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
        if(y > MaxY){
            MaxY = y
        }
        if(y < MinY){
            MinY = y
        }
    };

    console.log(`Located edge regions, FirstX = ${MinX}, LastX = ${MaxX}, FirstY = ${MinY} LastY = ${MaxY}`)
    let baseX = MinX * -1
    let baseY = MinY * -1
    let width = (difference(MinX,MaxX)+1)*regionSize
    let height = (difference(MinY,MaxY)+1)*regionSize
    console.log(`Creating canvas with width = ${width}, height = ${height}`)
    let canvas = await createCanvas(width,height)
    let ctx = await canvas.getContext('2d')
    //Loop through each image file, load it, and draw it to the canvas
    for(let fileName of files){
        //Get path to file
        let filePath = path.join(targetFolder,fileName)
        //Load image
        let imageData = await imageDataURI.encodeFromFile(filePath)
        let image = await loadImage(imageData,canvas)
        //Find region coordinates from the filename
        let regionCoords = fileName.split(",")
        let x = parseInt(regionCoords[0])
        let y = parseInt(regionCoords[1])
        //Draw image to canvas
        let pixX = (baseX+x)*regionSize
        let pixY = (baseY+y)*regionSize
        ctx.drawImage(image, pixX, pixY, regionSize, regionSize)
        console.log("drew",fileName)
    };

    //Save PNG file
    const image = await screenshotCanvas(canvas)
    const out = fs.writeFile(path.join("./","out.png"), image, 'base64', function(err) {
        if(err){
            console.log(err);
        }
        console.log('done')
        process.exit(0)
    });
})
