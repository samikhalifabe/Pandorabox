"use client"

import { useWhatsApp } from "@/components/WhatsAppContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeCanvas } from "qrcode.react"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function QRTestPage() {
  const { status, qrCode, refreshStatus, forceRefreshQrCode } = useWhatsApp()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshStatus()
      // Force aussi l'actualisation du QR code
      await forceRefreshQrCode()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test QR Code WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Statut: {status}</p>
            <p>QR Code data: {qrCode ? "Présent" : "Absent"}</p>
            <p>QR Code length: {qrCode ? qrCode.length : 0}</p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualisation...
                </>
              ) : (
                "Actualiser"
              )}
            </Button>
            {qrCode && (
              <div className="mt-4">
                <p>QR Code disponible :</p>
                <div className="bg-white p-4 rounded border inline-block">
                  <QRCodeCanvas 
                    value={qrCode} 
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>
            )}
            {!qrCode && status === "disconnected" && (
              <p>Pas de QR Code disponible</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}