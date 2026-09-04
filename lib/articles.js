import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'data', 'articles', 'published');

export function getSortedArticlesData() {
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const id = fileName.replace(/\.md$/, '');
            const fullPath = path.join(articlesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            
            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            return {
                id,
                ...matterResult.data
            };
        });

    // Sort articles by date
    return allArticlesData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllArticleIds() {
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            return {
                params: {
                    slug: fileName.replace(/\.md$/, '')
                }
            };
        });
}

export async function getArticleData(id) {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
        id,
        contentMarkdown: matterResult.content,
        ...matterResult.data
    };
}
