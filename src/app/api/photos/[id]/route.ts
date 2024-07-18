import { fetchGoogleImageById } from '@/utils/getImages';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const searchParams = request.nextUrl.searchParams;
    const { id } = params;
    const thumbnail = searchParams.get('thumbnail') === 'true';
    const desktop = searchParams.get('desktop') === 'true';

    if (!id || typeof id !== 'string') {
        return new Response(null, { status: 400 });
    }

    try {
        const img = await fetchGoogleImageById(id);
        if (!img) {
            return new Response(null, { status: 404 });
        }

        let imageUrl = img.default.url;
        if (thumbnail) {
            imageUrl = desktop ? img.thumbnailDesktop.url : img.thumbnail.url;
        }

        const response = await fetch(imageUrl);
        if (!response.ok) {
            return new Response(null, { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': img.mimeType,
            },
        });
    } catch (error) {
        console.error('Failed to fetch image', error);
        return new Response(null, { status: 500 });
    }
}
