declare const Bun: any

export type Process = {
    success: boolean;
    stdout: Buffer;
    stderr: Buffer;
}

export function spawnSync(command: string, ...args: string[]): Process {
    if (typeof Bun !== "undefined") {
        return Bun.spawnSync([command, ...args])
    } else {
        throw new Error("spawnSync is currently only implemented for the `bun` JS runtime")
    }
}
