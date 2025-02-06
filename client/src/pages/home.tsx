import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageContainer } from "@/components/ui/image-container";
import { PawPrint } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAudio } from "@/lib/use-audio";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [imageId, setImageId] = useState(0);
  const playMeow = useAudio("/api/meow");
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/cat", imageId],
    queryFn: async () => {
      try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search", {
          headers: {
            'x-api-key': import.meta.env.VITE_CAT_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cat image (${response.status})`);
        }

        const [data] = await response.json();
        playMeow();
        return data.url;
      } catch (error) {
        console.error('Error fetching cat image:', error);
        toast({
          title: "Uh oh! 😿",
          description: "Failed to fetch a new cat image. Please try again!",
          variant: "destructive"
        });
        throw error;
      }
    }
  });

  const generateNewCat = () => {
    setImageId(prev => prev + 1);
  };

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
          src={data} 
          isLoading={isLoading} 
          className="w-full aspect-square"
        />
      </Card>

      <Button
        size="lg"
        onClick={generateNewCat}
        className="text-lg gap-2 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl bg-primary/90 hover:bg-primary"
        disabled={isLoading}
      >
        <PawPrint className="w-6 h-6" />
        Generate New Cat 🎲
      </Button>

      <p className="text-sm text-muted-foreground animate-bounce">
        Psst! Turn up your volume for a surprise! 🔊
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Cat photos provided by The Cat API • Powered by Replit
      </p>
    </div>
  );
}