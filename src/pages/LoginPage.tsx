// LoginPage.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Shield, ArrowRight, Search, Scale } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleAuth = async (screen: 'login' | 'signup') => {
    await loginWithRedirect({
      authorizationParams: {
        audience: "https://dev-g43smrq082ahgyap.us.auth0.com/api/v2/",
        scope: "openid profile email offline_access",
        response_type: "code",
        screen_hint: screen,
      }
    });
  };

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      title: "Complete Protection",
      description: "Get detailed risk analysis across compensation, IP rights, non-compete terms, and more."
    },
    {
      icon: <Search className="w-5 h-5 text-blue-600" />,
      title: "Contract IQ",
      description: "Ask questions about your contracts and get instant, accurate answers powered by AI."
    },
    {
      icon: <Scale className="w-5 h-5 text-blue-600" />,
      title: "Legal Clarity",
      description: "Understand jurisdiction-specific insights on non-compete enforceability and termination terms."
    }
  ];

  const faqs = [
    {
      question: "How comprehensive is your contract analysis?",
      answer: "Our analysis covers every crucial aspect of your contract including compensation structures (base, commission tiers, and caps), benefits, termination terms, IP rights, non-compete clauses, confidentiality terms, and liability provisions. We break down complex structures, like tiered commission models and geographic restrictions, into clear, actionable insights."
    },
    {
      question: "How does your risk assessment work?",
      answer: "We evaluate risks across six key categories: compensation, termination, intellectual property, restrictive covenants, confidentiality, and liability. Each identified risk is assigned a severity level (high, medium, low) and comes with specific recommendations for mitigation. We focus particularly on hidden clauses that could impact your earnings or future opportunities."
    },
    {
      question: "How do you handle privacy and data security?",
      answer: "We prioritize your privacy with three key protections: 1) Automated personal information redaction before analysis, 2) End-to-end encryption for all documents, and 3) Optional complete contract deletion after analysis. You maintain full control over your data, with the ability to delete your information at any time."
    },
    {
      question: "What specific compensation elements do you analyze?",
      answer: "We analyze base compensation, commission structures (flat, tiered, or progressive), expense policies, and benefits packages. Our system specifically identifies commission caps, payment frequencies, guarantee periods, and any unusual deduction clauses that could affect your earnings."
    },
    {
      question: "How do you handle non-compete analysis?",
      answer: "We assess non-compete clauses for duration, geographic scope, and business scope, comparing them against state-specific legal standards. Our analysis includes evaluation of enforceability based on your jurisdiction and identification of potential negotiation points."
    },
    {
      question: "Can I see sample analysis results?",
      answer: "Yes! You can try our platform with a sample contract to see a complete analysis including risk assessment, compensation breakdown, and detailed explanations of complex terms. This will demonstrate our analysis of commission structures, non-compete terms, and other critical contract elements."
    },
    {
      question: "What happens after I get my analysis?",
      answer: "Your analysis includes a detailed risk assessment with specific recommendations for each identified issue. You'll receive plain-English explanations of complex terms, comparative insights against industry standards, and specific points for potential negotiation."
    },
    {
      question: "Do you provide legal advice?",
      answer: "No, we do not provide legal advice. Our platform provides analysis and insights to help you better understand your contracts, but we recommend consulting with a legal professional for specific legal advice. Our analysis can help you have more informed discussions with your legal counsel."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-[#1a73e8] truncate">
                Contractly
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => handleAuth('login')}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-[#1a73e8] hover:bg-gray-50 rounded-md whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuth('signup')}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] whitespace-nowrap"
              >
                Try Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8">
              They wrote it to confuse you.
              <span className="text-[#1a73e8] block">We'll make it crystal clear.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl">
              Every complex clause could cost you real money. Every vague term could slash your commissions. 
              Get instant clarity over your contracts with AI-powered analysis.
            </p>
            <button 
              onClick={() => handleAuth('signup')}
              className="bg-[#1a73e8] text-white px-8 py-3 rounded-lg hover:bg-[#1557b0] inline-flex items-center gap-2"
            >
              Try Contractly Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="space-y-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to understand your contracts?
            </h2>
            <p className="text-gray-600 mb-8">
              Get started now with our AI-powered contract analysis platform.
            </p>
            <button 
              onClick={() => handleAuth('signup')}
              className="bg-[#1a73e8] text-white px-8 py-3 rounded-lg hover:bg-[#1557b0] inline-flex items-center gap-2"
            >
              Try For Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};