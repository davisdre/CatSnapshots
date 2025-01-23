import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageContainer } from "@/components/ui/image-container";
import { PawPrint } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAudio } from "@/lib/use-audio";

export default function Home() {
  const [imageId, setImageId] = useState(0);
  const queryClient = useQueryClient();
  const playMeow = useAudio("/api/meow");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/cat", imageId],
    queryFn: async () => {
      const response = await fetch("https://api.thecatapi.com/v1/images/search");
      const [data] = await response.json();
      playMeow();
      return data.url;
    }
  });

  const generateNewCat = () => {
    setImageId(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-4xl font-bold text-primary tracking-tight">
        Purrfect Cat Generator
      </h1>

      <Card className="w-full max-w-2xl p-4">
        <ImageContainer 
          src={data} 
          isLoading={isLoading} 
          className="w-full aspect-square"
        />
      </Card>

      <Button
        size="lg"
        onClick={generateNewCat}
        className="text-lg gap-2 hover:scale-105 transition-transform"
      >
        <PawPrint className="w-6 h-6" />
        Generate New Cat
      </Button>
    </div>
  );
}
