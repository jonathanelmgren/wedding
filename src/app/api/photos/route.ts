import { getImages } from "@/utils/getImages";

export async function GET() {
    return Response.json(await getImages());
}