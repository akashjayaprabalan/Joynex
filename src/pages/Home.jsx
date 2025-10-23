import { Container, Button, Card } from '@components/ui';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized infrastructure.',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: Users,
      title: 'Built for Teams',
      description: 'Collaborate seamlessly with your team members in real-time.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Joynex
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Build amazing experiences with our powerful platform. 
              Connect, collaborate, and create something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Joynex?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to build your next big thing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who are already building with Joynex
            </p>
            <Button variant="secondary" size="lg">
              Start Your Free Trial
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;

