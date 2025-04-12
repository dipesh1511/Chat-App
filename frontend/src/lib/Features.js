import moment from "moment";


const fileFormat = (url="") =>{
    const fileExe = url.split(".").pop();

    if(fileExe === "mp4" || fileExe === "webm" || fileExe === "ogg") return "video";

    if(fileExe === "mp3" || fileExe === "webm") return "audio";

    if(fileExe === "png" || fileExe === "jpg" || fileExe === "jpeg" ||fileExe === "gif") return "image";
    
    return "file";
}

const TransformImage = (url="",width=100) => url;

const getLast7Days = () =>{
    const currentDate = moment();
    const last7Days = [];

    for(let i=0; i<7; i++){
        const dayDate = currentDate.clone().subtract(i,"days");
        const dayName = dayDate.format("dddd");

        last7Days.unshift(dayName);
    }
    return last7Days
};

export {fileFormat,TransformImage,getLast7Days};