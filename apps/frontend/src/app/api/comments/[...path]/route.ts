// API route to proxy comments requests with proper header forwarding
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

    console.log('[Comments Proxy] GET:', url);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('[Comments Proxy] Forwarding auth header');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Comments Proxy] GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from backend' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    console.log('[Comments Proxy] POST:', url);

    try {
        const body = await request.json();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('[Comments Proxy] Forwarding auth header');
        } else {
            console.warn('[Comments Proxy] No auth header found!');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Comments Proxy] Backend error:', response.status, errorText);
            return new NextResponse(errorText, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Comments Proxy] POST Error:', error);
        return NextResponse.json(
            { error: 'Failed to post to backend' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    console.log('[Comments Proxy] PATCH:', url);

    try {
        const body = await request.json();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Comments Proxy] Backend error:', response.status, errorText);
            return new NextResponse(errorText, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Comments Proxy] PATCH Error:', error);
        return NextResponse.json(
            { error: 'Failed to patch to backend' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    console.log('[Comments Proxy] DELETE:', url);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Comments Proxy] Backend error:', response.status, errorText);
            return new NextResponse(errorText, { status: response.status });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[Comments Proxy] DELETE Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete from backend' },
            { status: 500 }
        );
    }
}
