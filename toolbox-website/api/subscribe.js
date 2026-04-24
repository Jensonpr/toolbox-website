export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = '88ab48ec0d';
  const DC = 'us9';

  try {
    const response = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['Founding 500', 'Website Signup'],
        }),
      }
    );

    const data = await response.json();

    if (response.ok || data.title === 'Member Exists') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: data.detail || 'Signup failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}