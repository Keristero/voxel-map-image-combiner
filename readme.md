## 1.1
Removed the EXE because I could not package it's dependencies with it, sorry

### Usage
- You will need NodeJS installed, I used version 13.13.0
- Download this folder from git using the clone / download button
- open a command line window in this folder,
- run `npm install`
- run `node main.js C:\Users\Keris\Twitch\Minecraft\Instances\fabricWithVoxelmap\mods\mamiyaotaru\voxelmap\cache\test\overworld\images\z1` except obviously replace the path with the path to your modded minecraft directory
- if everything works, you will get an out.png file in the script's folder

### Notes
- If your voxelmap image directory does not exist, open `\mods\mamiyaotaru\voxelmap.properties` and add the line `Output Images:true`, after that load up your world and it will start saving images to the directory.

!["wow nice image man!"](sampleOutput.png "Example output image")
