"use client"

import { WhatsAppQRCode } from "@/components/WhatsAppQRCode"
import { WhatsAppProvider, useWhatsApp } from "@/components/WhatsAppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Smartphone, 
  Wifi, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from "lucide-react"
import Link from "next/link"

function WhatsAppConnectionContent() {
  const { status, qrCode, refreshStatus, lastChecked, isRefreshing } = useWhatsApp()

  const features = [
    {
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: "Sécurisé",
      description: "Connexion chiffrée end-to-end comme WhatsApp Web"
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Temps réel",
      description: "Messages synchronisés instantanément"
    },
    {
      icon: <Smartphone className="h-5 w-5 text-purple-500" />,
      title: "Multi-plateforme", 
      description: "Fonctionne sur tous vos appareils"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Connexion WhatsApp
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connectez votre WhatsApp pour automatiser vos conversations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* QR Code Section */}
          <div className="lg:col-span-2">
            <WhatsAppQRCode
              qrCode={qrCode}
              status={status}
              onRefresh={refreshStatus}
              isRefreshing={isRefreshing}
              lastChecked={lastChecked}
            />

            {/* Status Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Informations de connexion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Statut actuel
                    </p>
                    <Badge 
                      variant={status === "connected" ? "default" : "destructive"}
                      className={`${status === "connected" ? "bg-[#25D366]" : ""}`}
                    >
                      <Wifi className="h-3 w-3 mr-1" />
                      {status === "connected" ? "Connecté" : "Déconnecté"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Dernière vérification
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {lastChecked ? lastChecked.toLocaleString('fr-FR') : "Jamais"}
                    </p>
                  </div>
                </div>

                {status === "connected" && (
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle className="text-green-800 dark:text-green-200">
                      Connexion établie !
                    </AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Votre WhatsApp est connecté et prêt à être utilisé. Vous pouvez maintenant envoyer et recevoir des messages automatiquement.
                    </AlertDescription>
                  </Alert>
                )}

                {status === "disconnected" && (
                  <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-orange-800 dark:text-orange-200">
                      Connexion requise
                    </AlertTitle>
                    <AlertDescription className="text-orange-700 dark:text-orange-300">
                      Scannez le QR code avec votre téléphone pour établir la connexion WhatsApp.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités</CardTitle>
                <CardDescription>
                  Ce que vous pouvez faire une fois connecté
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.icon}
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/whatsapptest">
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Interface de test
                  </Button>
                </Link>
                
                <Link href="/conversations">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Voir les conversations
                  </Button>
                </Link>

                <Separator />

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Le QR code se rafraîchit automatiquement</p>
                  <p>• La connexion reste active même après fermeture</p>
                  <p>• Vous pouvez déconnecter depuis votre téléphone</p>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p><strong>Le QR code ne s'affiche pas ?</strong></p>
                  <p className="text-muted-foreground">
                    Actualisez la page ou cliquez sur "Actualiser le QR Code"
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-sm space-y-2">
                  <p><strong>Erreur de scan ?</strong></p>
                  <p className="text-muted-foreground">
                    Assurez-vous que votre téléphone a une connexion internet stable
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WhatsAppConnectionPage() {
  return (
    <WhatsAppProvider>
      <WhatsAppConnectionContent />
    </WhatsAppProvider>
  )
}