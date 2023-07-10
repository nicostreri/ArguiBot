//Tauri APIs
import { Command } from '@tauri-apps/api/shell'

const runArduinoCLI = async (args) => {
    args = args.concat(["--format", "json"]);
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
