"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLang } from "@/components/common/LangContext";

interface WelcomeCardProps {
  onStart: () => void;
}

export function WelcomeCard({ onStart }: WelcomeCardProps) {
  const { t } = useLang();

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground border-0 overflow-hidden" style={{ boxShadow: "0 4px 0 hsl(238 84% 50%)" }}>
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-foreground/20 rounded-2xl">
            <Sparkles className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">
              {t.welcomeTitle}
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              {t.welcomeSubtitle}
            </p>
          </div>
          <Button
            onClick={onStart}
            variant="secondary"
            size="lg"
            className="w-full h-14 text-lg font-black"
          >
            {t.welcomeCTA}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
