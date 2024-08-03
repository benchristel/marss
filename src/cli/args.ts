export type Arguments = {
    inputPath: string;
    outputPath: string;
}

export function parseArguments(rawArgs: string[]): Arguments {
    const [inputPath, outputPath] = rawArgs.slice(2)
    return {inputPath, outputPath}
}
