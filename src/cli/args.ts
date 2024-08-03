export type Arguments = {
    inputPath: string;
    outputPaths: string[];
}

export function parseArguments(rawArgs: string[]): Arguments {
    const [inputPath, ...outputPaths] = rawArgs.slice(2)
    return {inputPath, outputPaths}
}
