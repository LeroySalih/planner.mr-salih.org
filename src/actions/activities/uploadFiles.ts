// app/actions/upload.ts
'use server'

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { updateActivity } from './updateActivity'
import { getActivity } from './getActivity'
import { act } from 'react'
import { Activity } from './types'


// save the files to disk.
const saveFiles = async (activityId: string, formData: FormData) => {

  let result:{data: null | string[], error: null | string} = {data: null, error: null}

  try{

    //console.log("Uploading Files!!!");

    const files = formData.getAll('files') as File[]

    const uploadDir = path.join(process.cwd(), 'src', 'app', 'content', 'activity', activityId)
    await mkdir(uploadDir, { recursive: true }) // Ensure directory exists

    const savePaths: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = path.join(uploadDir, file.name)
      await writeFile(filePath, buffer)
      const savePath = `/${path.join('src', 'app', 'content', 'activity', activityId, file.name)}`;
      // savePaths.push(savePath);
      savePaths.push(file.name); // Store just the file name for simplicity
      //console.log(savePath, "uploaded successfully");
    }

    result.data = savePaths;
    
  } catch(err) {
    result.error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error("Error in saveFiles:", result.error);
  } finally {
    //console.log("*** saveFiles result:", result);
    return result;
  }

}


// save the files to the activity and update the activity in the database

export async function uploadFiles(formData: FormData) {

  let result:{data: null| string[] | Activity | Activity[], error: null | string} = {data: null, error: null}
  
  try{

    // get the activity id from the form data
    const activityId = formData.get('activity_id')?.toString()

    if (!activityId) {
      return { data: null, error: 'Missing activity_id' }
    }

    // save the files to the activity on disk
    const {data: saveFilesData, error: saveFilesError} = await saveFiles(activityId, formData);

    if (saveFilesError || saveFilesData === null){
      throw saveFilesError
    }

    // get the activty from the activity id
    const {data: activity, error: activityError} = await getActivity(activityId); 
    
    if (!activity) {
      return { data: null, error: 'Missing Activity from DB' }
    }

    //console.log("Old Activity:", activity);

    // update the body of the activity by appending the new images
    activity.body.images = [
      ...(activity.body.images || []), 
      ...saveFilesData.map((image, index)=>({id: index + (activity.body.images || []).length, original: image, thumbnail: image}))
    ];

    //console.log("SaveFile Data", JSON.stringify(saveFilesData, null, 2));
    //console.log("New Activity about to be saved:", JSON.stringify(activity, null, 2));

    // update the activity in the database
    const {data: writeDB, error: writeDBError} = await updateActivity({data: null, error: null}, activity);

    result.data = writeDB || null;
    result.error = writeDBError || null;
    //console.log("Write DB Result:", JSON.stringify(result, null, 2));

  } catch(err) {

    result.error = err instanceof Error ? err.message : 'Unknown error occurred';

    console.error("Error in uploadFiles:", result.error);

  }finally {
    
    return result;
  
  }
  
  
}
