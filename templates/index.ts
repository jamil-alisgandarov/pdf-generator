import * as ejs from 'ejs';

/**
 * Generates HTML string based on passed template path
 * and data.
 */
export async function generateHtml<D> (
    templatePath: string,
    data: D,
): Promise<string> {
    const html = await ejs.renderFile<string>(
        templatePath,
        data
    );

    return html;
}   
