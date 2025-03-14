import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener un contrato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const contract = await prisma.contract.findUnique({
      where: {
        id: params.id,
      },
    })
    
    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(contract)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al obtener el contrato' }, { status: 500 })
  }
}

// PUT - Actualizar un contrato por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const body = await request.json()
    
    const updatedContract = await prisma.contract.update({
      where: {
        id: params.id,
      },
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
    
    return NextResponse.json(updatedContract)
  } catch (error) {
    console.error('Error actualizando contrato:', error)
    return NextResponse.json({ error: 'Error al actualizar el contrato' }, { status: 500 })
  }
}

// DELETE - Eliminar un contrato por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    await prisma.contract.delete({
      where: {
        id: params.id,
      },
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al eliminar el contrato' }, { status: 500 })
  }
}