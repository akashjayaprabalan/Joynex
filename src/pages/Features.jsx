import { Container, Card } from '@components/ui';
import { Zap, Shield, Users, Globe, BarChart, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with cutting-edge technology ensuring instant load times and smooth interactions.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to keep your data safe and compliant.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration tools and shared workspaces.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'CDN-powered delivery ensures fast access from anywhere in the world.',
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Get detailed insights and analytics to make data-driven decisions.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you whenever you need it.',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, scale, and succeed. Our comprehensive 
            suite of features is designed to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Want to see it in action?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Schedule a demo with our team and discover how Joynex can transform your workflow
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Features;

