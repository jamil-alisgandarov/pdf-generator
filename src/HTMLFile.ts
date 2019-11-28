
import * as  fs from "fs";
import * as path from 'path';
import * as ejs from 'ejs';
import * as cuid from 'cuid';

import { promisify } from "util";

import { TEMPLATES_DIR } from "../templates/consts";
import { joinFileNameAndExt } from "./utils";
import { EFileExtension } from "./enums";

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

interface IHTMLFileDetails {
    name: string;
    extension: EFileExtension;
    baseDirection: string;
    fullPath: string;
    fullPathToView: string;
}

interface IFileConfiguration {
    templatePath: string;
    resourcesPath: string;
    data: any;
}

export class HTMLFile {
    public file: IHTMLFileDetails = {
        name: null,
        extension: EFileExtension.HTML,
        baseDirection: path.join(__dirname + '/../temp/'),
        fullPath: null,
        fullPathToView: null,
    };

    constructor (namePrefix: string) {
        this.setupFileDetails(namePrefix);
    }

    private setupFileDetails (namePrefix: string): void {
        const { baseDirection, extension } = this.file;

        const name = this.getUniqueFileName(namePrefix);
        const fullPath = baseDirection + joinFileNameAndExt(name, extension);
        const fullPathToView = `file://` + fullPath;

        this.file = {
            ...this.file,
            name,
            fullPath,
            fullPathToView,
        }
    }


    private getUniqueFileName = (fileNamePrefix?: string): string => {
        let name = `${cuid()}`;

        if (fileNamePrefix) {
            name = fileNamePrefix + '-' + name;
        }

        return name;
    }

    public generateHtmlAndSave = async (config: IFileConfiguration) => {
        const { fullPath, fullPathToView } = this.file;

        if (!fs.existsSync(this.file.baseDirection)) {
            fs.mkdirSync(this.file.baseDirection);
        }

        const html = await this.generateHtmlString(config);

        await writeFile(fullPath, html);

        return fullPathToView;
    }

    private async generateHtmlString ({
        templatePath,
        resourcesPath,
        data,
    }: IFileConfiguration) {
        return await ejs.renderFile(
            TEMPLATES_DIR + templatePath,
            {
                ...data,
                resourcesPath: TEMPLATES_DIR + resourcesPath,
            }
        );
    }

    public deleteFile = async () => {
        if (fs.existsSync(this.file.fullPath)) {
            await deleteFile(this.file.fullPath);
        }
    }
}
