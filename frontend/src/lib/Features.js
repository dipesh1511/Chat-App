

const fileFormat = (url="") =>{
    const fileExe = url.split(".").pop();

    if(fileExe === "mp4" || fileExe === "webm" || fileExe === "ogg") return "video";

    if(fileExe === "mp3" || fileExe === "webm") return "audio";

    if(fileExe === "png" || fileExe === "jpg" || fileExe === "jpeg" ||fileExe === "gif") return "image";
    
    return "file";
}

const TransformImage = (url="",width=100) => url;

export {fileFormat,TransformImage};