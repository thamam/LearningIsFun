import { NextRequest, NextResponse } from 'next/server';
import { getModule, Level, Language } from '@/lib/math';

export async function POST(request: NextRequest) {
  try {
    const { moduleName, level, lang } = await request.json();

    // Validate inputs
    if (!moduleName || !level) {
      return NextResponse.json(
        { error: 'Missing moduleName or level' },
        { status: 400 }
      );
    }

    // Get module
    const module = getModule(moduleName);
    if (!module) {
      return NextResponse.json(
        { error: `Module '${moduleName}' not found` },
        { status: 404 }
      );
    }

    // Generate question with language (default to 'he' if not provided)
    const question = module.generateQuestion(level as Level, (lang as Language) || 'he');

    return NextResponse.json({
      success: true,
      question,
      module: {
        name: module.name,
        id: module.id,
        icon: module.icon,
      },
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
