import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { preferredDate: "desc" } });

  const wb = new ExcelJS.Workbook();
  wb.creator = "Crown Shine Mobile Detailing";
  wb.created = new Date();
  const ws = wb.addWorksheet("Leads");

  ws.columns = [
    { header: "Created", key: "createdAt", width: 20 },
    { header: "Appt Date", key: "preferredDate", width: 14 },
    { header: "Time", key: "preferredTime", width: 12 },
    { header: "Status", key: "status", width: 12 },
    { header: "Customer", key: "customerName", width: 22 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 26 },
    { header: "Vehicle", key: "vehicle", width: 24 },
    { header: "Service", key: "serviceName", width: 20 },
    { header: "Address", key: "address", width: 28 },
    { header: "City", key: "city", width: 16 },
    { header: "Email Opt-in", key: "emailConsent", width: 13 },
    { header: "SMS Opt-in", key: "smsConsent", width: 12 },
    { header: "Customer Notes", key: "notes", width: 30 },
    { header: "Admin Notes", key: "adminNotes", width: 30 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).alignment = { vertical: "middle" };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  for (const b of bookings) {
    ws.addRow({
      createdAt: new Date(b.createdAt).toLocaleString("en-US"),
      preferredDate: new Date(b.preferredDate).toLocaleDateString("en-US"),
      preferredTime: b.preferredTime,
      status: b.status,
      customerName: b.customerName,
      phone: b.phone,
      email: b.email ?? "",
      vehicle: `${b.carYear ? b.carYear + " " : ""}${b.carMake} ${b.carModel}`.trim(),
      serviceName: b.serviceName,
      address: b.address,
      city: b.city,
      emailConsent: b.marketingEmailConsent ? "Yes" : "No",
      smsConsent: b.marketingSmsConsent ? "Yes" : "No",
      notes: b.notes ?? "",
      adminNotes: b.adminNotes ?? "",
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const filename = `crown-shine-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
