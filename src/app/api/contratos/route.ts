import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los contratos
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(contracts)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al obtener contratos' }, { status: 500 })
  }
}

// POST - Crear un nuevo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newContract = await prisma.contract.create({
      data: {
        title: body.title,
        object: body.object,
        desc: body.desc,
        content: body.content,
        dateStart: new Date(body.dateStart),
        dateEnd: new Date(body.dateEnd),
        ammount: parseFloat(body.ammount),
      },
    })
    
    return NextResponse.json(newContract, { status: 201 })
  } catch (error) {
    console.error('Error creando contrato:', error)
    return NextResponse.json({ error: 'Error al crear contrato' }, { status: 500 })
  }
}