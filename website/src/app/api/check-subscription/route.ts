import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) return NextResponse.json({ hasSubscription: false })

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const backendKey = process.env.BACKEND_API_KEY

    const resp = await fetch(`${backendUrl}/api/subscription/user/${encodeURIComponent(userId)}`, {
      headers: {
        'Authorization': `Bearer ${backendKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!resp.ok) {
      console.error('[CHECK-SUBSCRIPTION] backend responded', resp.status)
      return NextResponse.json({ hasSubscription: false })
    }

    const data = await resp.json()
    return NextResponse.json({ hasSubscription: Boolean(data.hasSubscription), subscription: data.subscription ?? null })
  } catch (error: any) {
    console.error('[CHECK-SUBSCRIPTION ERROR]', error?.message || error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
