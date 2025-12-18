export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "USAP - Minimal Messenger",
    "description": "Experience lightning-fast, minimalist messaging with USAP. No clutter, just pure communication.",
    "url": "https://usap.vercel.app",
    "applicationCategory": "CommunicationApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Raven",
      "url": "https://github.com/ravvdevv",
      "sameAs": ["https://github.com/ravvdevv"]
    },
    "featureList": [
      "Real-time messaging",
      "Minimal interface",
      "Fast performance",
      "No registration required",
      "Privacy-focused"
    ],
    "screenshot": "https://usap.vercel.app/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000+"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
