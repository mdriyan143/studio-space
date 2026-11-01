import type { Booking } from "@/lib/bookings"

export async function downloadInvoice(booking: Booking) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  const left = 20
  const right = 190
  let y = 22

  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.text("StudioSpace", left, y)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Booking Invoice", right, y, { align: "right" })

  y += 6
  doc.setDrawColor(200)
  doc.line(left, y, right, y)

  y += 10
  doc.setFontSize(10)
  doc.setTextColor(110)
  doc.text("Invoice no.", left, y)
  doc.text("Status", 110, y)
  y += 5
  doc.setTextColor(0)
  doc.setFont("helvetica", "bold")
  doc.text(`SS-${booking._id.slice(-8).toUpperCase()}`, left, y)
  doc.text(booking.status, 110, y)

  y += 12
  doc.setFont("helvetica", "normal")
  doc.setTextColor(110)
  doc.text("Billed to", left, y)
  doc.text("Hosted by", 110, y)
  y += 5
  doc.setTextColor(0)
  doc.setFont("helvetica", "bold")
  doc.text(booking.userName || "Guest", left, y)
  doc.text(booking.hostName || "Host", 110, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.text(booking.userEmail, left, y)
  doc.text(booking.hostEmail, 110, y)

  y += 14
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Studio details", left, y)
  y += 7
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Studio: ${booking.studioTitle}`, left, y)
  y += 6
  doc.text(`Location: ${booking.studioLocation}`, left, y)
  y += 6
  doc.text(`Date: ${booking.date}`, left, y)
  y += 6
  doc.text(
    `Time: ${booking.startTime} - ${booking.endTime} (${booking.hours} hr)`,
    left,
    y
  )

  y += 14
  doc.setFillColor(240, 240, 240)
  doc.rect(left, y - 5, right - left, 8, "F")
  doc.setFont("helvetica", "bold")
  doc.text("Description", left + 2, y)
  doc.text("Amount", right - 2, y, { align: "right" })

  y += 9
  doc.setFont("helvetica", "normal")
  doc.text(
    `Studio rental: ${booking.hours} hr x $${booking.hourlyRate.toFixed(2)}`,
    left + 2,
    y
  )
  doc.text(`$${booking.totalPrice.toFixed(2)}`, right - 2, y, {
    align: "right",
  })

  y += 6
  doc.setTextColor(110)
  doc.text("Refundable security deposit (not included in total)", left + 2, y)
  doc.text(`$${booking.securityDeposit.toFixed(2)}`, right - 2, y, {
    align: "right",
  })

  y += 5
  doc.setDrawColor(200)
  doc.line(left, y, right, y)

  y += 9
  doc.setTextColor(0)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Total", left + 2, y)
  doc.text(`$${booking.totalPrice.toFixed(2)}`, right - 2, y, {
    align: "right",
  })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    "Thank you for booking with StudioSpace. This receipt was generated automatically.",
    left,
    280
  )

  doc.save(`StudioSpace-invoice-${booking._id.slice(-8)}.pdf`)
}