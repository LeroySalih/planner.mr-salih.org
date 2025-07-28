"use server";
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';


const ACTIVTY_PATH = '/src/app/content/activity'

export async function listFilesForActivity(activityId: string): Promise<{ data: string[] | null; error: string | null }> {
    const dirPath = path.join(process.cwd(), ACTIVTY_PATH, activityId);

    if (!fsSync.existsSync(dirPath)) {
        return { data: null, error: 'Directory does not exist' };
    }
    
    if (!fsSync.lstatSync(dirPath).isDirectory()) {
        return { data: null, error: 'Path is not a directory' };
    }
    
    try {
        const files = await fs.readdir(dirPath);
        return { data: files, error: null };
    } catch (err: any) {
        return { data: [], error: err.message || 'Failed to list files' };
    }
}