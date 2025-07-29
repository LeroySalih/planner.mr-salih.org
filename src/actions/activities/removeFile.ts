// app/actions/upload.ts
'use server'

import { writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import { updateActivity } from './updateActivity'
import { getActivity } from './getActivity'
import { act } from 'react'
import { Activity } from './types'



// save the files to disk.
export const removeFile = async (prev: {data: any, error: any}, {activityId, fileName}:{activityId: string, fileName: string}) => {

  let result:{data: null | string, error: null | string} = {data: null, error: null}

  try{

    //console.log("Uploading Files!!!");
    const uploadDir = path.join(process.cwd(), 'src', 'app', 'content', 'activity', activityId)
    await mkdir(uploadDir, { recursive: true }) // Ensure directory exists
    rm(path.join(uploadDir, fileName)); // Remove the file if it exists  

    result.data = fileName;
    
  } catch(err) {
    result.error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error("Error in saveFiles:", result.error);
  } finally {
    //console.log("*** saveFiles result:", result);
    return result;
  }

}



