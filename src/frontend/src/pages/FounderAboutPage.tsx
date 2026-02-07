import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const founderContent = {
  name: "Ayaan Ahmed Dewan",
  role: "Founder & CEO",
  age: 18,
  location: "Assam, India",
  intro: "Ayaan Ahmed Dewan, 18-year-old founder from Assam, India, created M Employed to revolutionize global hiring. Passionate about equitable opportunities, I built this platform to instantly connect employers with talent—from tech innovators to essential pros like drivers, carpenters, plumbers, and housekeepers.",
  sections: [
    {
      title: "My Vision",
      content: "Frustrated by slow, biased job searches, I engineered smart matching that eliminates barriers and unlocks careers for everyone. I'm driving fairer teams worldwide."
    },
    {
      title: "Why Me",
      content: "A hands-on innovator blending high school grit, tech savvy, and people-first problem-solving to empower every worker's potential."
    }
  ]
};

export default function FounderAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl py-12 md:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <img
                src="/assets/generated/founder-photo.dim_512x512.jpg"
                srcSet="/assets/generated/founder-photo.dim_512x512.jpg 1x, /assets/generated/founder-photo.dim_1024x1024.jpg 2x"
                alt="Photo of Ayaan Ahmed Dewan"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {founderContent.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                {founderContent.role}
              </p>
              <p className="text-base text-muted-foreground">
                {founderContent.age} years old • {founderContent.location}
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Introduction */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground/90">
                {founderContent.intro}
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-6">
            {founderContent.sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Join Us on This Journey</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're looking to hire top talent or find your next opportunity, 
                  M Employed is here to help you succeed. Together, we're building a fairer, 
                  faster, and more equitable job market for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
