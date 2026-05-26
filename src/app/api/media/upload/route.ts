import { type NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { mediaTable, auditLogsTable } from '@/models/Schema';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const communityId = formData.get('communityId') as string | null;
    const caption = formData.get('caption') as string | null;

    if (!file || !communityId) {
      return NextResponse.json({ error: 'Missing file or communityId' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const uniqueName = `${crypto.randomUUID()}${extension}`;
    const filePath = join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    const mediaId = crypto.randomUUID();
    const [mediaRecord] = await db
      .insert(mediaTable)
      .values({
        id: mediaId,
        communityId,
        uploadedById: session.user.id,
        type: 'image',
        url: fileUrl,
        caption: caption ?? '',
        mimeType: file.type,
        sizeBytes: file.size,
        isHero: false,
      })
      .returning();

    await db.insert(auditLogsTable).values({
      actorId: session.user.id,
      action: 'upload_media',
      targetType: 'media',
      targetId: mediaId,
      after: { url: fileUrl },
    });

    return NextResponse.json({ success: true, media: mediaRecord });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}
