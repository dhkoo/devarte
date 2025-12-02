import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ImageMetadata {
  title: string;
  description: string;
}

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public/images');

  try {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
      .sort();

    // metadata.json 읽기
    let metadata: Record<string, ImageMetadata> = {};
    const metadataPath = path.join(imagesDir, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    }

    const images = imageFiles.map((file, index) => ({
      id: index + 1,
      url: `/images/${file}`,
      title: metadata[file]?.title || file.replace(/\.[^/.]+$/, ''),
      description: metadata[file]?.description || '',
    }));

    return NextResponse.json(images);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
