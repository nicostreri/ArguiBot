/**
 * @author Nicolás Streri
 * @description This module contains the functions related to the Arduino CLI.
 */
import { v4 as uuidv4 } from 'uuid';
import { checkLibrariesInstallation, getArduinoConfigFilePath } from './arduinoCLILibraryService';

//Tauri APIs
import { Command } from '@tauri-apps/api/shell'
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { exists, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';

const runArduinoCLI = async (args, withConfigFile = false) => {
    args = args.concat(["--format", "json"]);
    if(withConfigFile) 
        args = args.concat(["--config-file", await getArduinoConfigFilePath()]);
    return Command.sidecar("binaries/arduino-cli", args).execute();
}

/**
 * Get list of installed boards
 * @returns [{key: String(fqbn), name: String}]
 */
export const getInstalledBoards = async () => {
    const response = await runArduinoCLI(["board", "listall"]);

    if(response.code != 0){
        console.error("Fail get installed boards", response);
        return [];
    }

    //Parse
    const boards = JSON.parse(response.stdout).boards;
    return boards.map(b=>{return {"key": b.fqbn, "name": b.name}});
};

export const getAvailablePorts = async () => {
    const response  = await runArduinoCLI(["board", "list", "--discovery-timeout", "2s"]);

    if(response.code != 0){
        console.error("Fail get ports", response);
        return [];
    }

    //Parse
    const ports = JSON.parse(response.stdout);
    return ports.map(p=>{return {"key": p.port.address, "name": p.port.label}});
}

const getLocalSketchPath = async (sketchID = undefined) => {
    if(!sketchID) throw new Error("Undefined sketchID not allowed");
    const dataDir = await appLocalDataDir();
    const sketchPath = await join(dataDir, "sketches", sketchID);
    return sketchPath;
}

const getLocalSketchFilePath = async (sketchID = undefined) => {
    const sketchPath = await getLocalSketchPath(sketchID);
    const sketchFilePath = await join(sketchPath, sketchID + ".ino");
    return sketchFilePath;
}

/**
 * Create a new Arduino Sketch
 * @param {string} sketchID ID to use in the new sketch. If it is not defined, a random one will be generated.
 * @returns {string} ID of the created sketch
 */
const createNewSketch = async (sketchID = undefined) => {
    if(!sketchID) sketchID = uuidv4();
    const sketchPath = await getLocalSketchPath(sketchID);

    const response = await runArduinoCLI(["sketch", "new", sketchPath]);
    if(response.code != 0)
        throw new Error("No se pudo crear el Sketch.");

    return sketchID;
}

const sketchExists = async (sketchID) => {
    if(!sketchID) sketchID = "";
    const sketchFilePath = await getLocalSketchFilePath(sketchID)
    const result = await exists(sketchFilePath, {dir: BaseDirectory.AppLocalData});
    return result;
}

const checkSketchOrCreate = async (sketchID = undefined) => {
    if( !sketchID || !(await sketchExists(sketchID))){
        sketchID = await createNewSketch(sketchID);
    }
    return sketchID;
}

const saveSketch = async ({ sketchID = undefined, sourceCode = "" }) => {
    sketchID = await checkSketchOrCreate(sketchID);
    const sketchFilePath = await getLocalSketchFilePath(sketchID);

    //Save to file
    try {
        await writeTextFile(
            { path: sketchFilePath, contents: sourceCode }, 
            { dir: BaseDirectory.AppLocalData }
        );
        return sketchID;
    }catch (error) {
        throw new Error(`El sketch ${sketchID} no se pudo guardar.`);
    }
}

const compileSketch = async ({ sketchID = undefined, boardFQBN = "" }) => {
    sketchID = await checkSketchOrCreate(sketchID);
    const sketchPath = await getLocalSketchPath(sketchID);

    await checkLibrariesInstallation();
    const response = await runArduinoCLI(["compile", "-b", boardFQBN, sketchPath], true);
    if(response.code != 0){
        //Checks errors
        const compilerResponse = response.stdout;
        if(compilerResponse.indexOf("FQBN") > 0) throw new Error(`El FQBN ${boardFQBN} no está instalado.`);
        throw new Error("Error de compilación, comprobar el código construido.");
    }
    return sketchID;
};

const uploadSketch = async ({ sketchID = undefined, boardFQBN = "", boardPort = "" }) => {
    sketchID = await checkSketchOrCreate(sketchID);
    const sketchPath = await getLocalSketchPath(sketchID);

    await checkLibrariesInstallation();
    const response = await runArduinoCLI(["upload", "-b", boardFQBN, "-p", boardPort, "--discovery-timeout", "10s", sketchPath], true);
    if(response.code != 0){
        //Checks errors
        const compilerResponse = response.stderr;
        if(compilerResponse.indexOf("FQBN") > 0) throw new Error(`El FQBN ${boardFQBN} no está instalado.`);
        if(compilerResponse.indexOf("ser_open") > 0) throw new Error("Error de carga, revisar el puerto seleccionado.");
        throw new Error("Falló la carga del Sketch");
    }
    return sketchID;
}

/**
 * Verify, save, compile and upload code to Arduino.
 * @returns {string} sketchID
 */
export const verifySaveCompileAndUploadSketch = async ({ 
    sketchID = undefined, boardFQBN = "", boardPort = "", sourceCode = "",
    onUpdateProgress = alert
}) => {
    //Check args
    if(!boardFQBN) throw new Error("No se seleccionó una Placa de desarrollo.");
    if(!boardPort) throw new Error("No se seleccionó el puerto de la placa.");
    if(!sourceCode) throw new Error("No se ingresó código a compilar.");

    //Check sketch
    sketchID = await checkSketchOrCreate(sketchID);
    onUpdateProgress("✓ Sketch creado.");

    //Save and compile
    sketchID = await saveSketch({sketchID, sourceCode});
    onUpdateProgress("✓ Sketch guardado.");

    onUpdateProgress("Iniciando compilación del Sketch...");
    sketchID = await compileSketch({sketchID, boardFQBN});
    onUpdateProgress("✓ Compilado.");

    onUpdateProgress("Iniciando carga del Sketch...");
    sketchID = await uploadSketch({sketchID, boardFQBN, boardPort});
    onUpdateProgress("✓ Cargado.");

    return sketchID;
}
