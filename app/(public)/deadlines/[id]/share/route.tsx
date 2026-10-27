import Image from '@/lib/share-image';
export const revalidate = false;
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) { return Image(context); }
