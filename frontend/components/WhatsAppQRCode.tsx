"use client"

import React, { useState, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useWhatsApp } from "@/components/WhatsAppContext"
import { 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Wifi,
  WifiOff 
} from "lucide-react"

interface WhatsAppQRCodeProps {
  qrCode: string | null
  status: string
  onRefresh: () => void
  isRefreshing: boolean
  lastChecked: Date | null
}

export function WhatsAppQRCode({ 
  qrCode, 
  status, 
  onRefresh, 
  isRefreshing, 
  lastChecked 
}: WhatsAppQRCodeProps) {
  const { forceRefreshQrCode } = useWhatsApp()
  const [showInstructions, setShowInstructions] = useState(false)
  const [qrCodeError, setQrCodeError] = useState(false)
  const [isRefreshingQR, setIsRefreshingQR] = useState(false)

  // Auto-refresh QR code every 30 seconds if disconnected
  useEffect(() => {
    if (status === "disconnected" && qrCode) {
      const interval = setInterval(() => {
        onRefresh()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [status, qrCode, onRefresh])

  const handleQRCodeError = () => {
    setQrCodeError(true)
  }

  const handleQRCodeLoad = () => {
    setQrCodeError(false)
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Wifi className="h-5 w-5 text-green-500" />
      case "disconnected":
        return <WifiOff className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connecté"
      case "disconnected":
        return "Déconnecté"
      case "connecting":
        return "Connexion..."
      default:
        return "Inconnu"
    }
  }

  const getStatusVariant = () => {
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-[#25D366]/20">
      <CardHeader className="text-center bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getStatusIcon()}
          <CardTitle className="text-xl font-bold text-[#25D366]">
            WhatsApp Connection
          </CardTitle>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant={getStatusVariant()}
            className={`${status === "connected" ? "bg-[#25D366] text-white" : ""}`}
          >
            {getStatusText()}
          </Badge>
          {lastChecked && (
            <span className="text-xs text-muted-foreground">
              {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {status === "connected" ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                WhatsApp Connecté !
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Votre WhatsApp est connecté et prêt à envoyer des messages
              </p>
            </div>
          </div>
        ) : qrCode ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5 text-[#25D366]" />
                Scanner le QR Code
              </h3>
              <p className="text-sm text-muted-foreground">
                Utilisez votre téléphone pour scanner ce code
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-[#25D366]/20">
                {qrCodeError ? (
                  <div className="w-64 h-64 flex flex-col items-center justify-center text-red-500">
                    <AlertCircle className="h-12 w-12 mb-2" />
                    <p className="text-sm">Erreur de chargement du QR Code</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onRefresh}
                      className="mt-2"
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : (
                  <QRCodeCanvas 
                    value={qrCode} 
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                    onError={handleQRCodeError}
                    onLoad={handleQRCodeLoad}
                  />
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              {showInstructions ? "Masquer" : "Voir"} les instructions
            </Button>

            {showInstructions && (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Comment scanner le QR Code :</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Ouvrez WhatsApp sur votre téléphone</li>
                      <li>Appuyez sur le menu (⋮) en haut à droite</li>
                      <li>Sélectionnez "WhatsApp Web"</li>
                      <li>Appuyez sur "Scanner le code QR"</li>
                      <li>Pointez votre caméra vers ce QR code</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-2">
              <Button 
                onClick={onRefresh} 
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Statut
                  </>
                )}
              </Button>
              
              <Button 
                onClick={async () => {
                  setIsRefreshingQR(true)
                  try {
                    await forceRefreshQrCode()
                  } finally {
                    setIsRefreshingQR(false)
                  }
                }} 
                disabled={isRefreshingQR}
                variant="default"
                size="sm"
                className="bg-[#25D366] hover:bg-[#128C7E]"
              >
                {isRefreshingQR ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Nouveau QR...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Nouveau QR Code
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                En attente du QR Code
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-4">
                Le QR code se génère automatiquement...
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={onRefresh} 
                  disabled={isRefreshing}
                  variant="outline"
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vérifier statut
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={async () => {
                    setIsRefreshingQR(true)
                    try {
                      await forceRefreshQrCode()
                    } finally {
                      setIsRefreshingQR(false)
                    }
                  }} 
                  disabled={isRefreshingQR}
                  className="bg-[#25D366] hover:bg-[#128C7E]"
                >
                  {isRefreshingQR ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Générer QR Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}