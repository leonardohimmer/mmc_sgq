import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const includePending = url.searchParams.get("includePending") === "true";

        const whereClause = includePending ? {} : { status: { not: "PENDING" } };

        const surveys = await prisma.satisfactionSurvey.findMany({
            where: whereClause,
            include: {
                request: {
                    include: {
                        executionItems: {
                            include: {
                                partialInvoice: true
                            },
                            orderBy: {
                                numeroSequencial: 'asc'
                            }
                        },
                        partialInvoices: {
                            orderBy: {
                                dataEmissao: 'asc'
                            }
                        },
                        satisfactionSurvey: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ surveys }, { status: 200 });
    } catch (error) {
        console.error("Error fetching satisfaction surveys:", error);
        return NextResponse.json({ error: "Failed to fetch satisfaction surveys." }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, internalNotes } = body;

        if (!id) {
            return NextResponse.json({ error: "Survey ID is required" }, { status: 400 });
        }

        const dataToUpdate: any = {};
        if (status !== undefined) dataToUpdate.status = status;
        if (internalNotes !== undefined) dataToUpdate.internalNotes = internalNotes;

        const updatedSurvey = await prisma.satisfactionSurvey.update({
            where: { id },
            data: dataToUpdate,
            include: {
                request: {
                    select: {
                        id: true,
                        reportNumber: true,
                        clientName: true,
                        workName: true,
                    }
                }
            }
        });

        // Fluxo antigo: Não atualizamos o TestRequest aqui, pois ele já é finalizado pelo cliente
        // ou o fluxo segue de forma independente no administrativo.

        return NextResponse.json({ survey: updatedSurvey }, { status: 200 });
    } catch (error) {
        console.error("Error updating satisfaction survey:", error);
        return NextResponse.json({ error: "Failed to update satisfaction survey." }, { status: 500 });
    }
}
