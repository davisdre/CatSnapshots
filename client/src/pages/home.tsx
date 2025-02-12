import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageContainer } from "@/components/ui/image-container"
import { PawPrint } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateNewCat = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/meow', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch cat image')
      }
      const data = await response.json()
      if (!data?.url) {
        throw new Error('Invalid response format')
      }
      setImageUrl(data.url)
      // Play meow sound here if needed
    } catch (error) {
      console.error('Error generating cat:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate cat image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-background flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-primary tracking-tight flex items-center justify-center gap-3">
          <span>🐱</span>
          Purrfect Cat Generator
          <span>🐱</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Click to generate adorable cat pics! Each click brings a new feline friend ✨
        </p>
      </div>

      <Card className="w-full max-w-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <ImageContainer 
          src={imageUrl} 
          isLoading={isLoading} 
          className="w-full aspect-square rounded-lg"
          alt="A randomly generated cat image"
        />
      </Card>

      <Button
        size="lg"
        onClick={generateNewCat}
        className="text-lg gap-2 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl bg-primary/90 hover:bg-primary disabled:hover:scale-100"
        disabled={isLoading}
      >
        <PawPrint className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Generating...' : 'Generate New Cat 🎲'}
      </Button>

      <p className="text-sm text-muted-foreground animate-bounce">
        Psst! Turn up your volume for a surprise! 🔊
      </p>
      <p className="text-sm text-muted-foreground">
        Cat photos provided by The Cat API • Powered by Replit
      </p>
    </div>
  )
}