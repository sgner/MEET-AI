import {ipcMain} from "electron";

const winTitleOp = (callback)=>{
  ipcMain.on('winTitleOp',(e,data)=>{
    callback(e,data)
  })
}

export {
  winTitleOp
}
