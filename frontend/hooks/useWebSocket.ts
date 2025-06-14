"use client"

import { useState, useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import type { Database } from "@/types/supabase" // Assuming global Supabase types

// Define types locally for now, to be centralized later
type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"]
interface AppMessage {
  // Renamed to avoid conflict with Message from lucide-react
  id: string
  from: string
  to: string
  body: string
  timestamp: number
  isFromMe: boolean
  chatName: string
  chatId: string
  conversation_id?: string
  vehicle?: Vehicle | null
  message_id?: string
}

interface UseWebSocketOptions {
  onNewMessage: (message: AppMessage) => void
  socketUrl?: string
  enabled?: boolean // Nouvelle option pour activer/désactiver le WebSocket
}

export const useWebSocket = ({
  onNewMessage,
  socketUrl,
  enabled = true, // Activé par défaut
}: UseWebSocketOptions) => {
  // Déterminer l'URL WebSocket de manière sûre pour SSR
  const getSocketUrl = () => {
    if (socketUrl) return socketUrl;
    
    if (typeof window === 'undefined') {
      // Côté serveur, utiliser l'URL du backend
      return "http://pandorabox:3001";
    }
    
    // Côté client
    if (process.env.NODE_ENV === 'production') {
      return `${window.location.protocol}//${window.location.host}`;
    }
    
    return "http://31.97.69.92:3001";
  };
  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Ne pas initialiser côté serveur
    if (typeof window === 'undefined') return;
    
    // Ne pas initialiser le WebSocket si enabled est false
    if (!enabled) {
      if (socketRef.current) {
        console.log("🔌 WebSocket désactivé, fermeture de la connexion...")
        socketRef.current.disconnect()
        socketRef.current = null
        setSocketConnected(false)
      }
      return
    }

    // Initialiser le WebSocket seulement s'il n'existe pas déjà
    if (!socketRef.current) {
      const finalSocketUrl = getSocketUrl();
      console.log("🔌 Initializing WebSocket connection to:", finalSocketUrl)
      socketRef.current = io(finalSocketUrl)

      socketRef.current.on("connect", () => {
        console.log("✅ WebSocket connected!")
        console.log("🆔 Socket ID:", socketRef.current?.id)
        setSocketConnected(true)
      })

      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket disconnected!")
        setSocketConnected(false)
      })

      socketRef.current.on("connect_error", (error: any) => {
        console.error("❌ WebSocket connection error:", error)
        setSocketConnected(false)
      })

      socketRef.current.on("welcome", (data: any) => {
        console.log("👋 Welcome message received:", data)
      })

      socketRef.current.on("new_message", (message: AppMessage) => {
        console.log("📩 NEW MESSAGE RECEIVED VIA WEBSOCKET:")
        console.log("📩 Message type:", typeof message)
        console.log("📩 Message content:", JSON.stringify(message, null, 2))
        console.log("📩 Message ID:", message.id)
        console.log("📩 From:", message.from)
        console.log("📩 Body:", message.body)
        console.log("📩 Conversation ID:", message.conversation_id)
        console.log("📩 IsFromMe:", message.isFromMe)
        console.log("📩 Calling onNewMessage callback...")
        
        try {
          onNewMessage(message)
          console.log("✅ onNewMessage callback executed successfully")
        } catch (error) {
          console.error("❌ Error in onNewMessage callback:", error)
        }
      })
    }

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      if (socketRef.current) {
        console.log("🧹 Closing WebSocket connection...")
        socketRef.current.disconnect()
        socketRef.current = null
        setSocketConnected(false)
      }
    }
  }, [onNewMessage, socketUrl, enabled])

  // Fonction pour reconnecter manuellement le WebSocket
  const reconnect = () => {
    console.log("🔄 Manual WebSocket reconnection...")
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    if (enabled) {
      const finalSocketUrl = getSocketUrl();
      console.log("🔌 Reconnecting to:", finalSocketUrl)
      socketRef.current = io(finalSocketUrl)

      socketRef.current.on("connect", () => {
        console.log("✅ WebSocket reconnected!")
        setSocketConnected(true)
      })

      // Réattacher tous les écouteurs d'événements
      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket disconnected!")
        setSocketConnected(false)
      })

      socketRef.current.on("connect_error", (error: any) => {
        console.error("❌ WebSocket connection error:", error)
        setSocketConnected(false)
      })

      socketRef.current.on("welcome", (data: any) => {
        console.log("👋 Welcome message received:", data)
      })

      socketRef.current.on("new_message", (message: AppMessage) => {
        console.log("📩 NEW MESSAGE RECEIVED VIA WEBSOCKET (reconnected):")
        console.log("📩 Message content:", JSON.stringify(message, null, 2))
        
        try {
          onNewMessage(message)
          console.log("✅ onNewMessage callback executed successfully")
        } catch (error) {
          console.error("❌ Error in onNewMessage callback:", error)
        }
      })
    }
  }

  return { socketConnected, socket: socketRef.current, reconnect }
}
