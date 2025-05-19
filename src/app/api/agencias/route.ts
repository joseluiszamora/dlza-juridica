import {  NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los contratos
export async function GET() {
  console.log('GET /api/agencias')
  // const searchParams = new URLSearchParams(req.url.split("?")[1]);
  // const pageSize = 10;
  // const page = parseInt(searchParams.get("page")!);
  // const skip = (page - 1) * pageSize;

  // const name = searchParams.get("name");

  // Make Filter
  // const where: { bajaLogica: boolean; name?: string } = {
  //   bajaLogica: false,
  // };

  // if (name != "") {
  //   where["name"] = name!;
  // }

  // console.log('skip:', skip)
  // console.log('where:', where)

  try {
    // const count = await prisma.contract.count({
    //   where: where,
    // });

    const agencias = await prisma.agencia.findMany({
      // where: where,
      
      // skip,
      // take: pageSize,
    })
    
    return NextResponse.json({
      // total: count,
      data: agencias
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al obtener agencias' }, { status: 500 })
  }
}

// POST - Crear un nuevo contrato
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
    
//     const newContract = await prisma.contract.create({
//       data: {
//         title: body.title,
//         object: body.object,
//         desc: body.desc,
//         content: body.content,
//         dateStart: new Date(body.dateStart),
//         dateEnd: new Date(body.dateEnd),
//         ammount: parseFloat(body.ammount),
//       },
//     })
    
//     return NextResponse.json(newContract, { status: 201 })
//   } catch (error) {
//     console.error('Error creando contrato:', error)
//     return NextResponse.json({ error: 'Error al crear contrato' }, { status: 500 })
//   }
// }