import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const VIEWS_FILE = path.join(process.cwd(), 'data', 'views.json')

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get current view count
function getViews(): number {
  ensureDataDir()
  
  if (!fs.existsSync(VIEWS_FILE)) {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify({ views: 0, visitors: [] }))
    return 0
  }
  
  const data = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8'))
  return data.views || 0
}

// Increment view count
function incrementViews(ip: string): number {
  ensureDataDir()
  
  let data = { views: 0, visitors: [] as string[] }
  
  if (fs.existsSync(VIEWS_FILE)) {
    data = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8'))
  }
  
  // Check if IP already visited (unique visitors only)
  if (!data.visitors.includes(ip)) {
    data.views += 1
    data.visitors.push(ip)
    
    // Keep only last 10000 IPs to prevent file from growing too large
    if (data.visitors.length > 10000) {
      data.visitors = data.visitors.slice(-10000)
    }
    
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2))
  }
  
  return data.views
}

// GET - Return current views
export async function GET() {
  try {
    const views = getViews()
    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error reading views:', error)
    return NextResponse.json({ views: 0 }, { status: 500 })
  }
}

// POST - Increment and return views
export async function POST(request: Request) {
  try {
    // Get visitor IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const views = incrementViews(ip)
    
    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json({ views: 0 }, { status: 500 })
  }
}
