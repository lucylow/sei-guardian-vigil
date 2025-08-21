import { NextRequest, NextResponse } from 'next/server';
import { auditService } from '@/lib/auditService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const contractFile = formData.get('contract') as File;
    const blockchain = formData.get('blockchain') as string;
    const language = formData.get('language') as string;
    const auditDepth = formData.get('auditDepth') as string;

    if (!contractFile) {
      return NextResponse.json(
        { error: 'No contract file provided' },
        { status: 400 }
      );
    }

    // Read contract content
    const contractContent = await contractFile.text();
    const contractName = contractFile.name;

    // Start audit
    const auditId = await auditService.startAudit(
      contractContent,
      contractName,
      {
        blockchain: blockchain as any,
        language: language as any,
        auditDepth: auditDepth as any,
        includeGasAnalysis: true,
        includeFormalVerification: false
      }
    );

    return NextResponse.json({
      auditId,
      status: 'started',
      message: 'Audit started successfully'
    });

  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Failed to start audit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get('id');

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID required' },
        { status: 400 }
      );
    }

    const result = await auditService.getAuditResult(auditId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Get audit result error:', error);
    return NextResponse.json(
      { error: 'Failed to get audit result' },
      { status: 500 }
    );
  }
}
