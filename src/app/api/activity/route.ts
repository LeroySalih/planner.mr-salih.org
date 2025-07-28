import { uploadFiles } from "@/actions/activities/uploadFiles";

export async function POST(req: Request) {
  const formData = await req.formData()
  const result = await uploadFiles(formData)

  return Response.json(result)
}
