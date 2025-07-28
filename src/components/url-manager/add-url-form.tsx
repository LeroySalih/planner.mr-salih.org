"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

import type { UrlObject } from "."

interface AddUrlFormProps {
  onAddFiles: (files: File[]) => void
}

export default function AddUrlForm({ onAddFiles }: AddUrlFormProps) {


  const onDrop = useCallback((acceptedFiles:File[]) => {
    
    // notify the parent with just the files!!!
    onAddFiles(acceptedFiles);  
    
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return <Card>
    <CardContent className="p-6">
      <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
    </CardContent>
  </Card>

  
}
