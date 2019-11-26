
import * as  fs from "fs";
import { promisify } from "util";
import * as path from 'path';

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

interface IHTMLFileDetails {
    name: string;
    extension: string;
    direction: string;
}

export class HTMLFile {
    public file: IHTMLFileDetails = {
        name: null,
        extension: 'html',
        direction: path.join(__dirname + '/../../temp/'),
    };

    constructor () {
        this.file.name = new Date().getTime().toString();
    }

    public generateHtmlAndSave = async (html: string) => {
        if (!fs.existsSync(this.file.direction)) {
            fs.mkdirSync(this.file.direction);
        }

        await writeFile(this.joinFileNameAndDir(this.file), html);

        return this.getFilePath();
    }

    private joinFileNameAndDir ({ name, direction, extension }: IHTMLFileDetails): string {
        return direction + name + '.' + extension;
    }

    public getFilePath = (): string => {
        return `file://` + this.joinFileNameAndDir(this.file);
    }

    public deleteFile = async () => {
        await deleteFile(this.joinFileNameAndDir(this.file));
    }
}
