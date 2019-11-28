import { EFileExtension } from "./enums";

export function joinFileNameAndExt (
    name: string,
    extension: EFileExtension
): string {
    return name + '.' + extension;
}
