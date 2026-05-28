const mockTemplates = [
  {
    content: 'Finally got my passport renewed! The online system has improved a lot. Applied via Passport Seva Portal and got appointment within 3 days. #passport #renewal #india',
    sentiment: 'positive', category: 'Passport Renewal', platform: 'twitter',
  },
  {
    content: 'Applied for tatkal passport 2 weeks ago. Still waiting for police verification. Anyone else facing delays? #tatkal #passportdelay',
    sentiment: 'negative', category: 'Tatkal', platform: 'twitter',
  },
  {
    content: 'New passport seva kendra opened in our city! Great news for people tired of traveling to the regional office. #passportindia',
    sentiment: 'positive', category: 'Government Announcements', platform: 'reddit',
  },
  {
    content: 'WARNING: Received a fake call asking for OTP to process my passport application. Classic fraud attempt. Stay alert! #scam #passportfraud',
    sentiment: 'negative', category: 'Scam/Fraud', platform: 'twitter',
  },
  {
    content: 'Ministry of External Affairs announces new online tracking system for passport applications. Real-time updates now available.',
    sentiment: 'positive', category: 'Government Announcements', platform: 'youtube',
  },
  {
    content: 'My visa got rejected due to passport validity. Need at least 6 months validity for most countries. Lesson learned the hard way.',
    sentiment: 'negative', category: 'Visa', platform: 'reddit',
  },
  {
    content: 'The passport application process in India has become much smoother. Digital police verification in metro cities is a game changer!',
    sentiment: 'positive', category: 'Passport Application', platform: 'linkedin',
  },
  {
    content: 'Lost my passport 2 days before international trip. Emergency tatkal passport process was super helpful. Thank you Passport Seva!',
    sentiment: 'positive', category: 'Tatkal', platform: 'twitter',
  },
  {
    content: 'Passport appointment availability is very limited this month. Trying for 3 weeks now. Any tips? #passport #appointment',
    sentiment: 'negative', category: 'Passport Application', platform: 'reddit',
  },
  {
    content: 'Complete guide to passport renewal in India 2024 - Documents required, fees, timeline and tips',
    sentiment: 'neutral', category: 'News', platform: 'youtube',
  },
  {
    content: 'Passport application fee hiked from April 2024. New fees: Normal Rs 1500, Tatkal Rs 3500. Plan accordingly.',
    sentiment: 'neutral', category: 'Government Announcements', platform: 'twitter',
  },
  {
    content: 'Finally sharing my passport experience. First-time applicant. The whole process took exactly 21 days door to door. Not bad!',
    sentiment: 'positive', category: 'Personal Experiences', platform: 'reddit',
  },
  {
    content: 'PSK office staff were extremely rude and unhelpful. Kept rejecting documents citing unclear reasons. Escalated to MEA.',
    sentiment: 'negative', category: 'Travel Issues', platform: 'twitter',
  },
  {
    content: 'Pro tip: Book early morning passport appointments - less crowd, faster processing, and staff are in better mood!',
    sentiment: 'positive', category: 'Passport Application', platform: 'linkedin',
  },
  {
    content: 'Passport renewal done via Speed Post. Received fresh passport in 14 days. Online verification system rocks! #passportseva',
    sentiment: 'positive', category: 'Passport Renewal', platform: 'instagram',
  },
];

const users = [
  { username: 'travel_india_2024', displayName: 'Travel India', region: 'Mumbai' },
  { username: 'passport_help_india', displayName: 'Passport Help India', region: 'Delhi' },
  { username: 'rohan_sharma_42', displayName: 'Rohan Sharma', region: 'Bangalore' },
  { username: 'priya_travels', displayName: 'Priya Travels', region: 'Chennai' },
  { username: 'govtservices_india', displayName: 'Govt Services India', region: 'Hyderabad' },
  { username: 'amandeep_singh88', displayName: 'Amandeep Singh', region: 'Amritsar' },
  { username: 'visa_guide_2024', displayName: 'Visa Guide', region: 'Pune' },
  { username: 'travel_tales_raj', displayName: 'Raj Travel Tales', region: 'Jaipur' },
];

const platforms = ['twitter', 'reddit', 'youtube', 'linkedin', 'instagram', 'facebook'];

const generateMockPosts = (count = 30) => {
  const posts = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const template = mockTemplates[i % mockTemplates.length];
    const user = users[i % users.length];
    const platform = template.platform || platforms[i % platforms.length];
    const hoursAgo = Math.floor(Math.random() * 23) + 1;

    posts.push({
      platform,
      postId: `mock_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      username: user.username,
      displayName: user.displayName,
      content: template.content,
      sentiment: template.sentiment,
      sentimentScore: template.sentiment === 'positive' ? 0.7 : template.sentiment === 'negative' ? -0.7 : 0,
      category: template.category,
      language: 'en',
      region: user.region,
      country: 'India',
      hashtags: (template.content.match(/#\w+/g) || []).map(h => h.toLowerCase()),
      keywords: ['passport', 'india', 'travel'],
      engagement: {
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 5000),
        retweets: Math.floor(Math.random() * 80),
        upvotes: Math.floor(Math.random() * 200),
      },
      isSpam: false,
      spamScore: 0.05,
      isProcessed: true,
      processedAt: new Date(),
      postedAt: new Date(now - hoursAgo * 60 * 60 * 1000),
    });
  }

  return posts;
};

module.exports = { generateMockPosts };
