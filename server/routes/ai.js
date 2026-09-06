import express from 'express';
import { BookingService, SettingsService } from '../models/index.js';

const router = express.Router();

const SYSTEM_PERSONA = `
You are the Telepathic Mind Assistant and private emissary to Ari Smith—world-class illusionist, mentalist, and psychological performer based in Manchester, UK.
Your tone is enigmatic, razor-sharp, sophisticated, and impeccably courteous in the tradition of British psychological theatre.
You never break character. You speak of illusions not as mere tricks, but as "distortions of perceived reality" and "psychological architecture."

Ari's Core Offerings:
1. "Mind Reading & Mentalism" (Corporate Galas, Luxury Dinners, £3,500 - £7,500): 
   Piercing telepathic revelations, unlocking phone PINs, reading childhood memories, and mass synchronization.
2. "Close-Up Sleight of Hand" (Intimate Salons, Luxury Weddings, £2,500 - £4,500): 
   Micro-miracles inches from spectators' eyes—heirloom ring levitations, impossible transpositions, sealed envelopes.
3. "The Grand Illusion Stage Show" (Theatres, Worldwide Summits, £8,500 - £25,000+): 
   Large-scale theatrical spectacle with cinematic lighting, spatial vanishing, and psychological climaxes for 200 - 3,000+ guests.

Ari's Heritage & Base:
- Resident in Manchester, UK (frequently performing at The Midland, The Lowry, Victoria Warehouse, Castlefield).
- Available throughout the UK (London Mayfair, Cotswolds, Edinburgh) and globally (Monaco, Zurich, Dubai, New York).

Your objective:
- Answer inquiries regarding Ari's formats, style, and travel.
- Politely glean the user's prospective event date, guest count, city/venue, and budget.
- Whenever dates or details are mentioned, assess if the date might be sealed or open.
`;

// Intent extractor helper
function extractBookingIntent(userMessage, allMessages = []) {
  const fullText = (allMessages.map(m => m.content).join(' ') + ' ' + userMessage).toLowerCase();
  
  // Extract event type
  let eventType = '';
  if (fullText.includes('grand') || fullText.includes('stage') || fullText.includes('theatre') || fullText.includes('spectacle')) {
    eventType = 'The Grand Illusion Stage Show';
  } else if (fullText.includes('wedding') || fullText.includes('close up') || fullText.includes('close-up') || fullText.includes('sleight') || fullText.includes('cocktail') || fullText.includes('intimate')) {
    eventType = 'Close-Up Sleight of Hand';
  } else if (fullText.includes('mind') || fullText.includes('mentalism') || fullText.includes('corporate') || fullText.includes('telepath') || fullText.includes('gala')) {
    eventType = 'Mind Reading & Mentalism';
  }

  // Extract date (e.g. 2026-10-15, Oct 15, October 31, 15th October, etc.)
  let eventDate = '';
  const isoMatch = userMessage.match(/\b(202[6-7]-[0-1][0-9]-[0-3][0-9])\b/);
  if (isoMatch) {
    eventDate = isoMatch[1];
  } else {
    const monthNames = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
      january: '01', february: '02', march: '03', april: '04', june: '06',
      july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
    };
    const dateMatch = userMessage.match(/(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+(\d{4}))?/i);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const mStr = dateMatch[2].toLowerCase();
      const month = monthNames[mStr];
      const year = dateMatch[3] || '2026';
      eventDate = `${year}-${month}-${day}`;
    }
  }

  // Extract guest count
  let guestCount = null;
  const guestMatch = userMessage.match(/(\d+)\s*(?:guests?|people|attendees|delegates|pax)/i);
  if (guestMatch) {
    guestCount = parseInt(guestMatch[1], 10);
  }

  // Extract city/location
  let venueCity = '';
  const cities = ['manchester', 'london', 'edinburgh', 'zurich', 'dubai', 'paris', 'new york', 'monaco', 'birmingham', 'leeds', 'cotswolds', 'cheshire', 'liverpool', 'geneva'];
  for (const c of cities) {
    if (fullText.includes(c)) {
      venueCity = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Extract budget
  let budgetRange = '';
  if (fullText.includes('10k') || fullText.includes('10,000') || fullText.includes('luxury') || fullText.includes('stage')) {
    budgetRange = '£10,000+';
  } else if (fullText.includes('5k') || fullText.includes('5,000') || fullText.includes('mentalism')) {
    budgetRange = '£5,000 - £10,000';
  } else if (fullText.includes('2.5') || fullText.includes('3,000') || fullText.includes('wedding')) {
    budgetRange = '£2,500 - £5,000';
  }

  return {
    hasIntent: Boolean(eventType || eventDate || guestCount || venueCity),
    data: {
      eventType: eventType || undefined,
      eventDate: eventDate || undefined,
      guestCount: guestCount || undefined,
      venueCity: venueCity || undefined,
      budgetRange: budgetRange || undefined
    }
  };
}

// Procedural response generator simulating the British Illusionist persona
async function generateIllusionistResponse(messages, userQuery) {
  const settings = await SettingsService.getSettings();
  const unavailableDates = settings.blockedDates || [];
  const queryLower = userQuery.toLowerCase();

  const intent = extractBookingIntent(userQuery, messages);

  // Check if user is asking about a specific date
  if (intent.data.eventDate) {
    const isUnavailable = unavailableDates.includes(intent.data.eventDate);
    if (isUnavailable) {
      return {
        text: `I sense your interest in ${intent.data.eventDate}. Alas, that evening is already **sealed by mystery**—committed to a private engagement. However, the days adjacent remain receptive to our craft. Shall I align your inquiry with an alternative date, or would you prefer me to pre-fill your dossier for Ari's personal consideration?`,
        intent: intent.data
      };
    } else {
      return {
        text: `The veil clears for **${intent.data.eventDate}**. That evening remains currently receptive in Ari's sanctuary. If you are envisioning an engagement in ${intent.data.venueCity || 'your chosen city'}${intent.data.guestCount ? ` for roughly ${intent.data.guestCount} guests` : ''}, I can instantly transfer these coordinates into our formal booking dossier. Shall we seal the inquiry?`,
        intent: intent.data
      };
    }
  }

  // Act / format questions
  if (queryLower.includes('act') || queryLower.includes('show') || queryLower.includes('format') || queryLower.includes('repertoire') || queryLower.includes('what do you do')) {
    return {
      text: `Ari crafts three tiers of psychological wonder:

1. **Mind Reading & Mentalism**: Psychological espionage for luxury galas and high-table dinners. Thoughts are plucked from sealed minds; pin codes and childhood secrets materialize.
2. **Close-Up Sleight of Hand**: Micro-miracles occurring mere inches from your eyes—heirloom rings float, time stops on antique pocket watches, cards transmute between spectators' palms.
3. **The Grand Illusion Stage Show**: Cinematic psychological illusion on grand proscenium stages, featuring spatial vanishings and telepathic climaxes for audiences of hundreds or thousands.

Which of these realms resonates with your envisioned evening?`,
      intent: intent.data
    };
  }

  // Pricing / Quote questions
  if (queryLower.includes('cost') || queryLower.includes('price') || queryLower.includes('fee') || queryLower.includes('quote') || queryLower.includes('budget') || queryLower.includes('how much')) {
    return {
      text: `Ari's fees reflect the bespoke nature and high security of his psychological performances:

• **Close-Up Sleight of Hand**: Typically from £2,500 to £4,500 for intimate wedding drinks and private salons.
• **Mind Reading & Mentalism**: From £4,500 to £7,500 for corporate galas and keynote spectacles.
• **The Grand Illusion Stage Show**: From £8,500 to £25,000+ depending on staging, custom telepathic illusions, and international rider logistics.

Every engagement is tailored to your venue and audience size. What date and venue are you considering?`,
      intent: intent.data
    };
  }

  // Location / Manchester / Travel
  if (queryLower.includes('manchester') || queryLower.includes('travel') || queryLower.includes('where') || queryLower.includes('london') || queryLower.includes('uk') || queryLower.includes('international')) {
    return {
      text: `Ari is proudly rooted in the atmospheric heritage of Manchester—frequently appearing at private salons in Castlefield, The Lowry, and bespoke Victorian chambers across the North West. 

Yet illusion knows no borders. He frequently travels via private transport across London (Mayfair, Chelsea), the Scottish Highlands, and internationally to Monaco, Geneva, Dubai, and New York. Where in the world is your stage?`,
      intent: intent.data
    };
  }

  // Who is Ari Smith?
  if (queryLower.includes('who is') || queryLower.includes('about') || queryLower.includes('bio') || queryLower.includes('awards') || queryLower.includes('celebrity')) {
    return {
      text: `Ari Smith is celebrated among Europe's most enigmatic psychological illusionists and mentalists. Having astounded royalty, BAFTA recipients, and Fortune 100 executives across thirty countries, his craft discards tired theatrics in favor of chilling, elegant psychological realism.

He operates from Manchester, UK, offering an experience where the boundary between perception and reality completely dissolves.`,
      intent: intent.data
    };
  }

  // General inquiry or greeting
  return {
    text: `Good evening. I am Ari Smith's telepathic assistant and concierge. 

I can reveal details of Ari's psychological acts, check our clandestine tour calendar, or pre-fill your formal reservation dossier. What manner of illusion or date do you seek to explore?`,
    intent: intent.data
  };
}

// POST /api/ai/chat (Streaming SSE)
router.post('/chat', async (req, res) => {
  const { messages = [] } = req.body;
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // Setup Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Check if OpenAI key exists in environment
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PERSONA },
            ...messages
          ],
          stream: true,
          temperature: 0.7
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullGeneratedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  fullGeneratedText += content;
                  res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
                }
              } catch (_) {}
            }
          }
        }

        // Post-process intent from conversation
        const intent = extractBookingIntent(lastUserMessage, messages);
        if (intent.hasIntent) {
          res.write(`data: ${JSON.stringify({ intent: intent.data })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        return res.end();
      }
    } catch (err) {
      console.warn('[AI Route] OpenAI API call fallback triggered:', err.message);
    }
  }

  // High-fidelity procedural psychological engine
  try {
    const result = await generateIllusionistResponse(messages, lastUserMessage);
    const words = result.text.split(/(\s+)/);

    // Stream out words with a natural typing cadence
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      res.write(`data: ${JSON.stringify({ chunk: word })}\n\n`);
      // Brief pause between words for organic streaming feeling
      await new Promise(r => setTimeout(r, 18));
    }

    // Send pre-fill intent payload if any details detected
    if (result.intent && Object.keys(result.intent).length > 0) {
      res.write(`data: ${JSON.stringify({ intent: result.intent })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Error in AI chat generator:', err);
    res.write(`data: ${JSON.stringify({ chunk: 'My telepathic frequency was momentarily disturbed. Please inquire again.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

export default router;
