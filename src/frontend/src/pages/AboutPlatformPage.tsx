import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Users, Zap, Globe, Shield, TrendingUp } from 'lucide-react';

const platformContent = {
  headline: "About M Employed",
  tagline: "M Employed; Am Employed",
  intro: "M Employed is a revolutionary job platform designed to eliminate barriers in the hiring process. We connect employers with qualified candidates across all industries—from tech professionals to essential workers like drivers, carpenters, plumbers, and housekeepers—through smart matching technology that prioritizes skills and potential over traditional biases.",
  mission: {
    title: "Our Mission",
    description: "To create a fairer, faster, and more accessible job market where every worker can find meaningful employment and every employer can discover the right talent without unnecessary friction or bias."
  },
  features: [
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Our smart algorithm connects employers with qualified candidates in real-time, dramatically reducing time-to-hire."
    },
    {
      icon: Users,
      title: "All Industries Welcome",
      description: "From tech innovators to skilled tradespeople, we serve every sector of the workforce with equal dedication."
    },
    {
      icon: Shield,
      title: "Bias-Free Hiring",
      description: "Our platform focuses on skills, experience, and potential—not demographics—to ensure fair opportunities for all."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with talent and opportunities worldwide, breaking down geographical barriers to employment."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "We're not just about finding jobs—we're about building careers and fostering long-term professional development."
    },
    {
      icon: Briefcase,
      title: "Streamlined Process",
      description: "Simple, intuitive tools for posting jobs, applying, and managing applications—no complexity, just results."
    }
  ],
  values: [
    {
      title: "Equity",
      description: "Every candidate deserves a fair shot based on their abilities, not their background."
    },
    {
      title: "Speed",
      description: "Time matters. We eliminate unnecessary delays in the hiring process."
    },
    {
      title: "Transparency",
      description: "Clear communication and honest processes build trust between employers and candidates."
    },
    {
      title: "Innovation",
      description: "We continuously improve our platform with cutting-edge technology and user feedback."
    }
  ],
  cta: {
    title: "Ready to Transform Your Hiring?",
    description: "Whether you're seeking your next career opportunity or looking to build your dream team, M Employed is here to make it happen. Join thousands of employers and candidates who are already experiencing the future of work."
  }
};

export default function AboutPlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl py-12 md:py-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {platformContent.headline}
            </h1>
            <p className="text-xl text-muted-foreground">
              {platformContent.tagline}
            </p>
          </div>

          <Separator className="my-8" />

          {/* Introduction */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground/90">
                {platformContent.intro}
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">{platformContent.mission.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">
                {platformContent.mission.description}
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformContent.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {platformContent.values.map((value, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-semibold">{platformContent.cta.title}</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {platformContent.cta.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
