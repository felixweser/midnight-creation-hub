import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Code, Laptop, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <nav className="glass fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-accent/90 bg-clip-text text-transparent">
              BlackUI
            </span>
            <div className="flex space-x-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">About</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary/90 to-accent/90 bg-clip-text text-transparent">
            Modern Dark Interface
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the perfect blend of elegance and functionality with our
            modern dark interface design system.
          </p>
          <Button size="lg" className="hover-card">
            Explore Features <ChevronRight className="ml-2" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "Lightning Fast",
              description: "Optimized for maximum performance and speed.",
            },
            {
              icon: <Code className="w-6 h-6 text-primary" />,
              title: "Clean Code",
              description: "Built with modern best practices and clean architecture.",
            },
            {
              icon: <Laptop className="w-6 h-6 text-primary" />,
              title: "Responsive",
              description: "Perfectly adapted for all screen sizes and devices.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="glass hover-card p-6 flex flex-col items-center text-center"
            >
              {feature.icon}
              <h3 className="text-lg font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;