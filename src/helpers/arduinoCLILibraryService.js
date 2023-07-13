/**
 * @author Nicolás Streri
 * @description This module contains the functions related to the Arduino CLI Libraries.
 */
import { UPDATE_LIBRARIES_URL } from '../config/globals';

//Tauri APIs
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { exists, BaseDirectory, writeTextFile, readTextFile, createDir } from '@tauri-apps/api/fs';
import { download } from 'tauri-plugin-upload-api';
import { invoke } from '@tauri-apps/api';

export const getArduinoConfigFilePath = async () => {
    const appLocalDataDirResp = await appLocalDataDir();
    const arduinoConfigFilePath = await join(appLocalDataDirResp, "arduino-cli.json");
    return arduinoConfigFilePath;
}

const updateLibrariesInfo = async (newVersion, newPath) => {
    const dataToSave = JSON.stringify({
        directories: {
            user: newPath,
            currentVersion: newVersion
        }
    });
    try{
        await writeTextFile(await getArduinoConfigFilePath(), dataToSave, { dir: BaseDirectory.AppLocalData });
    }catch(e){
        throw new Error("Error al configurar Arduino CLI con el nuevo Pack de bibliotecas.");
    }
    
}

const getArduinoLibrariesInfo = async () => {
    let arduinoCLIConfigs = undefined;
    try {
        arduinoCLIConfigs = JSON.parse(await readTextFile(
            await getArduinoConfigFilePath(), 
            { dir: BaseDirectory.AppLocalData }
        ));
    } catch (error) {
        console.error(error);
    }

    const installed = arduinoCLIConfigs != undefined;
    const libPath = arduinoCLIConfigs?.directories?.user;
    const libVersion = arduinoCLIConfigs?.directories?.currentVersion;
    if(installed && (!libPath || !libVersion)) 
        throw new Error("Archivo de configuración de Arduino-CLI corrupto.");
    
    console.log("Library Pack info: ", installed, libPath, libVersion);
    return {installed, libPath, libVersion};
}

export const checkLibrariesInstallation = async () => {
    const arduinoData = await getArduinoLibrariesInfo();
    if(!arduinoData.installed) 
        throw new Error("Pack de Bibliotecas no instalado.");
    
    const result = await exists(arduinoData.libPath, { dir: BaseDirectory.AppLocalData });
    if(!result) throw new Error("Pack de Bibliotecas corrupto. Reinstalar.");
}

const getLastVersionFromServer = async () => {
    try{
        const response = await fetch(UPDATE_LIBRARIES_URL).then(response => {
            if(!response.ok) throw new Error("...");
            return response.json()
        });
        return response;
    } catch (error){
        throw new Error("Error de conexión con el Servidor al buscar actulizaciones.")
    }
}

const checkAvailableLibrariesUpdate = async () => {
    const arduinoData = await getArduinoLibrariesInfo();
    if(!arduinoData.installed) return true;

    const installedVersion = arduinoData.libVersion;
    const lastVersion =  (await getLastVersionFromServer()).lastVersion;
    console.log("Check version update", installedVersion, lastVersion);
    return installedVersion < lastVersion;
}

export const installLibrariesUpdate = async (callback) => {
    const upgradable = await checkAvailableLibrariesUpdate();
    if(!upgradable) return false;
    const updataInfo = await getLastVersionFromServer();

    const appLocalDataDirResp = await appLocalDataDir();
    const tempFilePath = await join(appLocalDataDirResp, "temp.zip");
    const destFolderPath = await join(appLocalDataDirResp, "Arduino", "Arduino" + updataInfo.lastVersion);

    //Downloading
    callback({"event": "startDownload"});
    try{
        await download(updataInfo.downloadURL, tempFilePath, (progress, total) => {
            callback({"event": "progress", progress, total});
        });
    }catch(e){
        throw new Error("Error al descargar la nueva versión");
    }
    callback({"event": "finishDownload"});
    callback({"event": "startInstall"});

    //Extracting
    //TODO crear si no existe la carpeta Arduino
    await createDir(destFolderPath, { dir: BaseDirectory.AppLocalData, recursive: true});
    const opts = {srcZip: tempFilePath, outDir: destFolderPath};
    try{
        await invoke('plugin:extract|extract', opts);
    }catch(e){
        console.log(e);
        throw new Error("Error al descomprimir la nueva versión.");
    }

    //Save new path on Arduino CLI config file
    await updateLibrariesInfo(updataInfo.lastVersion, destFolderPath);
    callback({"event": "finishInstall"});
    return true;
};
