import { NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digitadist API',
      version: '1.0.0',
      description: 'API documentation for Digitadist backend endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./app/api/**/*.ts', './app/api/**/*.js'],
};

export async function GET() {
  try {
    const spec = swaggerJSDoc(options);
    return NextResponse.json(spec);
  } catch (error) {
    console.log('Error generating swagger spec:', error);
    return NextResponse.json({ error: 'Failed to generate specification' }, { status: 500 });
  }
}
