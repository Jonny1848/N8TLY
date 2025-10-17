# KI-Integration für N8TLY Event-App 🤖

Dieses Dokument beschreibt strategische Möglichkeiten zur Integration von Künstlicher Intelligenz in die N8TLY App.

---

## 🎯 Übersicht: KI-Features nach Priorität

| Priorität | Feature | Screen | Impact | Komplexität | Kosten |
|-----------|---------|--------|--------|-------------|--------|
| ⭐⭐⭐ | Personalisierte Empfehlungen | Discover | 🔥 Sehr hoch | Mittel | Niedrig |
| ⭐⭐⭐ | Smart Event Search | Events | ⚡ Hoch | Niedrig | Niedrig |
| ⭐⭐⭐ | Going Solo Matching | Discover | 💡 Sehr hoch | Mittel | Niedrig |
| ⭐⭐ | Event Memories Analyse | Social | 🎨 Hoch | Mittel | Mittel |
| ⭐⭐ | Smart Chat Replies | Social | 💬 Mittel | Niedrig | Niedrig |
| ⭐ | Event Description Generator | Host Dashboard | 🎯 Mittel | Niedrig | Niedrig |
| ⭐ | Predictive Analytics | Host Dashboard | 📊 Mittel | Hoch | Mittel |

---

## 1. Personalisierte Event-Empfehlungen ⭐⭐⭐

### Wo wird's eingebaut?
**Screen:** [`app/(tabs)/discover.tsx`](app/(tabs)/discover.tsx:1) - "Für dich empfohlen" Sektion

### Was macht die KI?
- Analysiert User-Präferenzen (Musikgeschmack, besuchte Events, Freunde)
- Lernt aus Interaktionen (Likes, Ticket-Käufe, Event-Views, Dwell-Time)
- Berechnet Match-Score (bereits im UI: 95% Match Badge)
- Aktualisiert sich kontinuierlich basierend auf User-Verhalten

### Technische Implementation

#### Option A: OpenAI GPT-4o-mini (Empfohlen für MVP)
```typescript
// lib/ai/recommendations.ts
import OpenAI from 'openai';
import { supabase } from '../supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserProfile {
  music_genres: string[];
  party_preferences: string[];
  favorite_city: string;
  age: number;
}

interface EventHistory {
  attended: Event[];
  interested: Event[];
  purchased_tickets: Event[];
}

async function getPersonalizedRecommendations(userId: string) {
  // 1. Hole User-Daten
  const userProfile = await getUserProfile(userId);
  const eventHistory = await getUserEventHistory(userId);
  const availableEvents = await getUpcomingEvents(userProfile.favorite_city);
  
  // 2. Erstelle KI-Prompt
  const prompt = `Du bist ein Event-Empfehlungs-Experte für Nightlife & Partys.

USER PROFIL:
- Musikgeschmack: ${userProfile.music_genres.join(', ')}
- Party-Präferenzen: ${userProfile.party_preferences.join(', ')}
- Stadt: ${userProfile.favorite_city}
- Alter: ${userProfile.age}

BESUCHTE EVENTS (letzte 3 Monate):
${eventHistory.attended.map(e => `- ${e.title} (${e.event_type}, ${e.music_genres.join('/')})`).join('\n')}

VERFÜGBARE EVENTS:
${availableEvents.map(e => `ID: ${e.id} | ${e.title} | ${e.event_type} | ${e.music_genres.join('/')} | ${e.date}`).join('\n')}

AUFGABE:
Empfehle die TOP 5 Events für diesen User. Berücksichtige:
1. Musik-Präferenzen (sehr wichtig)
2. Event-Type-Präferenzen
3. Vergangene Events (Ähnlichkeit)
4. Datum (nicht zu weit in Zukunft bevorzugt)

Gib zurück als JSON:
{
  "recommendations": [
    {
      "event_id": "uuid",
      "match_score": 95,
      "reason": "Kurze, prägnante Begründung warum das passt"
    }
  ]
}`;

  // 3. KI-Anfrage
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  
  const recommendations = JSON.parse(response.choices[0].message.content);
  
  // 4. Speichere für Analytics
  await supabase.from('ai_recommendations').insert({
    user_id: userId,
    recommendations: recommendations,
    created_at: new Date().toISOString(),
  });
  
  return recommendations;
}

// Helper Functions
async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data } = await supabase
    .from('profiles')
    .select('music_genres, party_preferences, favorite_city, age')
    .eq('id', userId)
    .single();
  return data;
}

async function getUserEventHistory(userId: string): Promise<EventHistory> {
  const { data: attended } = await supabase
    .from('event_attendees')
    .select('*, events(*)')
    .eq('user_id', userId)
    .eq('status', 'attended')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: interested } = await supabase
    .from('event_attendees')
    .select('*, events(*)')
    .eq('user_id', userId)
    .eq('status', 'interested')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, events(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    attended: attended?.map(a => a.events) || [],
    interested: interested?.map(i => i.events) || [],
    purchased_tickets: tickets?.map(t => t.events) || [],
  };
}

async function getUpcomingEvents(city: string) {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'active')
    .gte('date', new Date().toISOString())
    .or(`location->city.eq.${city},location->city.is.null`)
    .order('date', { ascending: true })
    .limit(50);
  return data || [];
}
```

#### Option B: Embedding-basierte Empfehlungen (Günstiger, skaliert besser)
```typescript
// lib/ai/embeddings.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Erstelle User-Profil Embedding
async function createUserEmbedding(userProfile: UserProfile) {
  const profileText = `
    Musikgeschmack: ${userProfile.music_genres.join(', ')}
    Party-Präferenzen: ${userProfile.party_preferences.join(', ')}
    Stadt: ${userProfile.favorite_city}
  `;
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: profileText,
  });
  
  return response.data[0].embedding;
}

// Erstelle Event Embedding
async function createEventEmbedding(event: Event) {
  const eventText = `
    ${event.title}
    ${event.description}
    Typ: ${event.event_type}
    Musik: ${event.music_genres.join(', ')}
  `;
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: eventText,
  });
  
  return response.data[0].embedding;
}

// Berechne Ähnlichkeit (Cosine Similarity)
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Empfehlungen basierend auf Embeddings
async function getRecommendationsByEmbeddings(userId: string) {
  const userProfile = await getUserProfile(userId);
  const userEmbedding = await createUserEmbedding(userProfile);
  
  const events = await getUpcomingEvents(userProfile.favorite_city);
  
  const recommendations = await Promise.all(
    events.map(async (event) => {
      const eventEmbedding = await createEventEmbedding(event);
      const similarity = cosineSimilarity(userEmbedding, eventEmbedding);
      
      return {
        event_id: event.id,
        match_score: Math.round(similarity * 100),
        event: event,
      };
    })
  );
  
  // Sortiere nach Match-Score
  return recommendations
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}
```

### Frontend-Integration

```typescript
// app/(tabs)/discover.tsx
import { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '../../lib/ai/recommendations';

export default function DiscoverScreen() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRecommendations();
  }, []);
  
  const loadRecommendations = async () => {
    try {
      const userId = await getCurrentUserId();
      const recs = await getPersonalizedRecommendations(userId);
      setRecommendations(recs.recommendations);
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... Rest des Components
}
```

### Kosten-Kalkulation
- **GPT-4o-mini:** ~$0.15 pro 1M Input-Tokens, ~$0.60 pro 1M Output-Tokens
- **Pro User pro Tag:** ~500 Tokens = $0.0003
- **Bei 10.000 aktiven Usern:** ~$3/Tag = $90/Monat
- **Embeddings (Alternative):** ~$0.02 pro 1M Tokens = noch günstiger!

### Mehrwert
🔥 **RIESIG** - Das ist das Kernfeature, das User täglich zurückbringt!

---

## 2. Smart Event Search mit Natural Language ⭐⭐⭐

### Wo wird's eingebaut?
**Screen:** [`app/(tabs)/events.tsx`](app/(tabs)/events.tsx:1) - Suchleiste

### Was macht die KI?
Versteht natürliche Sprache und extrahiert automatisch Filter-Parameter:

**Beispiele:**
- "Techno Party heute Abend in Kreuzberg" → `{type: 'club', genre: 'techno', location: 'Kreuzberg', date: 'today'}`
- "Rooftop mit House am Wochenende unter 20€" → `{type: 'rooftop', genre: 'house', date: 'weekend', maxPrice: 20}`
- "Open Air Festival nächsten Monat" → `{type: 'festival', date: 'next_month'}`

### Implementation

```typescript
// lib/ai/search.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SearchFilters {
  event_types?: string[];
  music_genres?: string[];
  location?: string;
  date_range?: { start: string; end: string };
  price_range?: { min: number; max: number };
  search_term?: string;
}

async function parseNaturalLanguageSearch(query: string): Promise<SearchFilters> {
  const prompt = `Extrahiere Event-Filter aus dieser Suchanfrage.

Suchanfrage: "${query}"

Mögliche Filter:
- event_types: ["club", "rooftop", "bar", "festival", "concert", "outdoor"]
- music_genres: ["techno", "house", "hip-hop", "electronic", "trance", "minimal", "deep-house"]
- location: Stadt oder Bezirk
- date_range: start/end (ISO format)
- price_range: min/max (Euro)
- search_term: Freitext wenn spezifischer Event-Name genannt

Gib zurück als JSON. Nur gefundene Filter inkludieren.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
}

// Suche mit KI-extrahierten Filtern
async function searchEventsWithAI(query: string) {
  const filters = await parseNaturalLanguageSearch(query);
  
  let queryBuilder = supabase
    .from('events')
    .select('*')
    .eq('status', 'active');

  if (filters.event_types?.length) {
    queryBuilder = queryBuilder.in('event_type', filters.event_types);
  }

  if (filters.music_genres?.length) {
    queryBuilder = queryBuilder.contains('music_genres', filters.music_genres);
  }

  if (filters.location) {
    queryBuilder = queryBuilder.ilike('location->>city', `%${filters.location}%`);
  }

  if (filters.date_range) {
    queryBuilder = queryBuilder
      .gte('date', filters.date_range.start)
      .lte('date', filters.date_range.end);
  }

  if (filters.price_range) {
    queryBuilder = queryBuilder
      .gte('ticket_price', filters.price_range.min)
      .lte('ticket_price', filters.price_range.max);
  }

  if (filters.search_term) {
    queryBuilder = queryBuilder.ilike('title', `%${filters.search_term}%`);
  }

  const { data } = await queryBuilder;
  return data;
}
```

### Frontend-Integration mit Debouncing

```typescript
// app/(tabs)/events.tsx
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { searchEventsWithAI } from '../../lib/ai/search';

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Debounce für Performance
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;
      
      setSearching(true);
      try {
        const events = await searchEventsWithAI(query);
        setResults(events);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  return (
    <TextInput
      placeholder="z.B. 'Techno heute Abend in Kreuzberg'"
      value={searchQuery}
      onChangeText={handleSearchChange}
    />
  );
}
```

### Kosten
- **Pro Suchanfrage:** ~200 Tokens = $0.00003
- **Bei 1000 Suchen/Tag:** ~$0.90/Monat
- **Sehr günstig!**

---

## 3. Going Solo: Smart Matching ⭐⭐⭐

### Wo wird's eingebaut?
**Screen:** [`app/(tabs)/discover.tsx`](app/(tabs)/discover.tsx:1) - "Allein unterwegs" Sektion

### Was macht die KI?
- Findet User mit ähnlichen Interessen für dasselbe Event
- Berechnet "Compatibility Score" basierend auf Profilen
- Erstellt automatisch passende Gruppen (3-5 Personen)
- Generiert Eisbrecher-Nachrichten für erste Chats

### Implementation

```typescript
// lib/ai/matching.ts
import OpenAI from 'openai';

interface MatchResult {
  user_id: string;
  compatibility_score: number;
  common_interests: string[];
  ice_breaker_suggestions: string[];
}

async function findGoingSoloMatches(
  userId: string,
  eventId: string
): Promise<MatchResult[]> {
  // 1. Hole alle "Going Solo" User für dieses Event
  const { data: soloUsers } = await supabase
    .from('event_attendees')
    .select('user_id, profiles(*)')
    .eq('event_id', eventId)
    .eq('going_solo', true)
    .neq('user_id', userId);

  const currentUser = await getUserProfile(userId);

  // 2. Erstelle Embeddings für alle User
  const currentUserEmbedding = await createUserEmbedding(currentUser);
  
  const matches = await Promise.all(
    soloUsers.map(async (solo) => {
      const soloUserEmbedding = await createUserEmbedding(solo.profiles);
      const compatibility = cosineSimilarity(currentUserEmbedding, soloUserEmbedding);
      
      // 3. Finde gemeinsame Interessen
      const commonInterests = findCommonInterests(currentUser, solo.profiles);
      
      // 4. Generiere Eisbrecher mit KI
      const iceBreakers = await generateIceBreakers(
        currentUser,
        solo.profiles,
        commonInterests
      );
      
      return {
        user_id: solo.user_id,
        compatibility_score: Math.round(compatibility * 100),
        common_interests: commonInterests,
        ice_breaker_suggestions: iceBreakers,
      };
    })
  );

  // 5. Sortiere nach Compatibility
  return matches
    .filter(m => m.compatibility_score > 70) // Nur gute Matches
    .sort((a, b) => b.compatibility_score - a.compatibility_score);
}

async function generateIceBreakers(
  user1: UserProfile,
  user2: UserProfile,
  commonInterests: string[]
): Promise<string[]> {
  const prompt = `Erstelle 3 Eisbrecher-Nachrichten für ein Match auf einer Event-App.

Person 1: ${user1.age} Jahre, mag ${user1.music_genres.join(', ')}
Person 2: ${user2.age} Jahre, mag ${user2.music_genres.join(', ')}

Gemeinsame Interessen: ${commonInterests.join(', ')}

Erstelle lockere, freundliche Eisbrecher die zu einem Event passen.
Keine langen Texte, max 1-2 Sätze.
Gib als JSON Array zurück.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.ice_breakers || [];
}

function findCommonInterests(user1: UserProfile, user2: UserProfile): string[] {
  const common: string[] = [];
  
  // Musik-Genres
  const commonGenres = user1.music_genres.filter(g => 
    user2.music_genres.includes(g)
  );
  common.push(...commonGenres);
  
  // Party-Präferenzen
  const commonPrefs = user1.party_preferences.filter(p => 
    user2.party_preferences.includes(p)
  );
  common.push(...commonPrefs);
  
  return [...new Set(common)]; // Remove duplicates
}
```

### Auto-Gruppen-Erstellung

```typescript
// lib/ai/groups.ts
async function createGoingSoloGroupChat(
  eventId: string,
  userIds: string[]
): Promise<string> {
  // 1. Erstelle Conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({
      type: 'group',
      event_id: eventId,
      name: 'Going Solo Gruppe',
      created_by: userIds[0],
    })
    .select()
    .single();

  // 2. Füge alle User hinzu
  const participants = userIds.map(userId => ({
    conversation_id: conversation.id,
    user_id: userId,
  }));
  
  await supabase
    .from('conversation_participants')
    .insert(participants);

  // 3. Sende Willkommens-Nachricht mit KI
  const welcomeMessage = await generateGroupWelcomeMessage(
    eventId,
    userIds.length
  );
  
  await supabase
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender_id: null, // System message
      content: welcomeMessage,
      type: 'system',
    });

  return conversation.id;
}

async function generateGroupWelcomeMessage(
  eventId: string,
  memberCount: number
): Promise<string> {
  const event = await getEvent(eventId);
  
  const prompt = `Erstelle eine kurze, enthusiastische Willkommens-Nachricht für eine "Going Solo" Gruppe.

Event: ${event.title}
Anzahl Mitglieder: ${memberCount}

Die Nachricht soll:
- Freundlich und einladend sein
- Ermutigen, sich auszutauschen
- Erwähnen, dass alle alleine zum Event gehen
- Max 2-3 Sätze

Gib nur die Nachricht zurück, kein JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return response.choices[0].message.content;
}
```

### UI-Integration

```tsx
// components/discover/GoingSoloCard.tsx
function GoingSoloCard({ match }: { match: MatchResult }) {
  const [showIceBreakers, setShowIceBreakers] = useState(false);
  
  const sendIceBreaker = async (message: string) => {
    // Erstelle Chat und sende Nachricht
    await createDirectMessage(match.user_id, message);
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{match.user.name}</Text>
        <Badge>{match.compatibility_score}% Match</Badge>
      </View>
      
      <View style={styles.interests}>
        {match.common_interests.map(interest => (
          <Chip key={interest}>{interest}</Chip>
        ))}
      </View>
      
      <Pressable onPress={() => setShowIceBreakers(!showIceBreakers)}>
        <Text>Eisbrecher anzeigen</Text>
      </Pressable>
      
      {showIceBreakers && (
        <View style={styles.iceBreakers}>
          {match.ice_breaker_suggestions.map((suggestion, i) => (
            <Pressable 
              key={i}
              onPress={() => sendIceBreaker(suggestion)}
              style={styles.iceBreakerButton}
            >
              <Text>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
```

### Mehrwert
💡 **KILLER-FEATURE!** - Das macht euer "Going Solo" einzigartig und löst das Problem "alleine zu Events"

---

## 4. Event Memories: Automatische Bildanalyse ⭐⭐

### Wo wird's eingebaut?
**Screen:** [`app/(tabs)/social.tsx`](app/(tabs)/social.tsx:1) - Event Memories Gallery

### Was macht die KI?
- Analysiert hochgeladene Fotos automatisch
- Erkennt: Location, Stimmung, Tageszeit, Personen-Anzahl
- Generiert automatische Captions
- Filtert unpassende/schlechte Bilder
- Erstellt automatisch Highlight-Reel pro Event

### Implementation

```typescript
// lib/ai/vision.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ImageAnalysis {
  caption: string;
  mood: string;
  quality_score: number;
  tags: string[];
  is_appropriate: boolean;
  highlight_worthy: boolean;
}

async function analyzeEventPhoto(imageUrl: string): Promise<ImageAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: `Analysiere dieses Event-Foto und gib zurück als JSON:
          {
            "caption": "Kurzer, cooler Caption (max 50 Zeichen, mit Emojis)",
            "mood": "energetic/chill/wild/cozy",
            "quality_score": 1-10,
            "tags": ["crowd", "lights", "dancefloor", etc.],
            "is_appropriate": true/false (keine nackten Personen, Drogen, Gewalt),
            "highlight_worthy": true/false (ist das Foto highlight-würdig?)
          }`
        },
        {
          type: "image_url",
          image_url: { url: imageUrl }
        }
      ]
    }],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });

  return JSON.parse(response.choices[0].message.content);
}

// Auto-Caption beim Upload
async function uploadEventMemory(
  conversationId: string,
  eventId: string,
  userId: string,
  imageUri: string
) {
  // 1. Upload zu Supabase Storage
  const fileName = `${eventId}/${Date.now()}.jpg`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('event-memories')
    .upload(fileName, imageUri);

  if (uploadError) throw uploadError;

  const publicUrl = supabase.storage
    .from('event-memories')
    .getPublicUrl(fileName).data.publicUrl;

  // 2. KI-Analyse
  const analysis = await analyzeEventPhoto(publicUrl);

  // 3. Nur speichern wenn appropriate
  if (!analysis.is_appropriate) {
    await supabase.storage.from('event-memories').remove([fileName]);
    throw new Error('Foto entspricht nicht unseren Community-Guidelines');
  }

  // 4. Speichere in DB mit Auto-Caption
  const { data: memory } = await supabase
    .from('event_memories')
    .insert({
      conversation_id: conversationId,
      event_id: eventId,
      uploaded_by: userId,
      image_url: publicUrl,
      caption: analysis.caption,
      metadata: {
        mood: analysis.mood,
        quality_score: analysis.quality_score,
        tags: analysis.tags,
        highlight_worthy: analysis.highlight_worthy,
      }
    })
    .select()
    .single();

  // 5. Sende Notification im Chat
  if (analysis.highlight_worthy) {
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      type: 'memory_shared',
      content: `${getUserName(userId)} hat ein Highlight-Foto geteilt! 🔥`,
      metadata: { memory_id: memory.id }
    });
  }

  return memory;
}
```

### Highlight-Reel Generator

```typescript
// lib/ai/highlights.ts
async function createEventHighlightReel(eventId: string) {
  // 1. Hole alle Memories für Event
  const { data: memories } = await supabase
    .from('event_memories')
    .select('*')
    .eq('event_id', eventId);

  // 2. Filtere nur "highlight_worthy" Fotos
  const highlights = memories
    .filter(m => m.metadata.highlight_worthy && m.metadata.quality_score >= 7)
    .sort((a, b) => b.metadata.quality_score - a.metadata.quality_score)
    .slice(0, 10); // Top 10

  // 3. Erstelle Reel mit KI-generierten Transitions
  const reelDescription = await generateReelDescription(highlights);

  // 4. Speichere Reel
  await supabase.from('event_highlight_reels').insert({
    event_id: eventId,
    memories: highlights.map(h => h.id),
    description: reelDescription,
    created_at: new Date().toISOString(),
  });

  return highlights;
}

async function generateReelDescription(memories: any[]) {
  const moodSummary = memories.map(m => m.metadata.mood).join(', ');
  
  const prompt = `Erstelle eine kurze, enthusiastische Beschreibung für ein Event-Highlight-Reel.

Anzahl Fotos: ${memories.length}
Stimmungen: ${moodSummary}

Max 2 Sätze, mit passenden Emojis.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return response.choices[0].message.content;
}
```

### Kosten
- **GPT-4o Vision:** ~$5 pro 1M Tokens
- **Pro Foto-Analyse:** ~1000 Tokens = $0.005
- **Bei 1000 Fotos/Tag:** ~$5/Tag = $150/Monat
- **Mittel-teuer, aber macht das USP-Feature viel besser!**

---

## 5. Smart Chat Replies & Übersetzungen ⭐⭐

### Wo wird's eingebaut?
**Screen:** Chat-Conversations

### Was macht die KI?

#### A) Quick Reply Suggestions
```typescript
// lib/ai/chat.ts
async function suggestQuickReplies(
  conversationId: string,
  lastMessages: Message[]
): Promise<string[]> {
  const context = lastMessages
    .map(m => `${m.sender_name}: ${m.content}`)
    .join('\n');

  const prompt = `Basierend auf diesem Chat-Verlauf, schlage 3 passende Antworten vor:

${context}

Anforderungen:
- Kurz und prägnant (max 30 Zeichen)
- Zur Konversation passend
- Freundlich und casual
- Auf Deutsch

Gib als JSON Array zurück.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.suggestions || [];
}
```

#### B) Echtzeit-Übersetzungen
```typescript
async function translateMessage(
  message: string,
  targetLanguage: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Übersetze folgende Nachricht nach ${targetLanguage}. 
      Behalte den Ton und Style bei.
      
      Nachricht: "${message}"`
    }],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}
```

#### C) Smart Event-Detail Erkennung
```typescript
async function extractEventDetailsFromMessage(message: string) {
  const prompt = `Analysiere diese Chat-Nachricht und extrahiere Event-Details:

"${message}"

Falls eine Zeit, Location oder Event-Name erwähnt wird, gib zurück als JSON:
{
  "has_event_details": true/false,
  "time": "ISO datetime oder null",
  "location": "string oder null",
  "event_name": "string oder null",
  "action_suggestion": "create_calendar_event" oder "open_maps" oder null
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### UI-Integration

```tsx
// components/chat/MessageInput.tsx
function MessageInput() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    loadSuggestions();
  }, [lastMessages]);
  
  const loadSuggestions = async () => {
    const sug = await suggestQuickReplies(conversationId, lastMessages);
    setSuggestions(sug);
  };
  
  return (
    <View>
      {/* Quick Reply Chips */}
      <ScrollView horizontal>
        {suggestions.map((suggestion, i) => (
          <Pressable 
            key={i}
            onPress={() => sendMessage(suggestion)}
          >
            <Text>{suggestion}</Text>
          </Pressable>
        ))}
      </ScrollView>
      
      {/* Input Field */}
      <TextInput ... />
    </View>
  );
}
```

---

## 6. Event Description Generator (für Hosts) ⭐

### Wo wird's eingebaut?
**Screen:** [`app/(host)/create-event.tsx`](ARCHITECTURE.md:259) (noch zu erstellen)

### Implementation

```typescript
// lib/ai/host.ts
async function generateEventDescription(eventDetails: {
  title: string;
  type: string;
  musicGenres: string[];
  djs?: string[];
  venue?: string;
  date: string;
}) {
  const prompt = `Erstelle eine ansprechende Event-Beschreibung für:

Titel: ${eventDetails.title}
Typ: ${eventDetails.type}
Musik: ${eventDetails.musicGenres.join(', ')}
${eventDetails.djs ? `DJs: ${eventDetails.djs.join(', ')}` : ''}
${eventDetails.venue ? `Location: ${eventDetails.venue}` : ''}
Datum: ${eventDetails.date}

Anforderungen:
- Enthusiastisch und einladend
- 2-3 Absätze
- Mit passenden Emojis
- Erwähne Highlights
- Call-to-Action am Ende

Gib als JSON zurück:
{
  "description": "...",
  "suggested_tags": ["tag1", "tag2"],
  "social_media_post": "Kürzere Version für Instagram/Twitter"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

## 7. Predictive Analytics (für Hosts) ⭐

### Was macht die KI?
- Vorhersagt Ticket-Verkäufe
- Empfiehlt optimalen Preis
- Identifiziert beste Promotion-Zeiten
- Warnt vor Konkurrenz-Events

### Implementation

```typescript
// lib/ai/analytics.ts
async function predictTicketSales(eventId: string) {
  const event = await getEvent(eventId);
  const historicalData = await getHistoricalEventData(event);
  const competition = await getCompetingEvents(event);
  
  const prompt = `Analysiere und prognostiziere Ticket-Verkäufe:

EVENT:
${JSON.stringify(event, null, 2)}

HISTORISCHE DATEN (ähnliche Events):
${JSON.stringify(historicalData, null, 2)}

KONKURRENZ (gleicher Tag):
${JSON.stringify(competition, null, 2)}

Gib zurück als JSON:
{
  "predicted_sales": number,
  "confidence": "low/medium/high",
  "recommended_price": number,
  "peak_buying_times": ["day", "time"],
  "competition_risk": "low/medium/high",
  "recommendations": ["string array mit Tipps"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

## 💰 Gesamtkosten-Übersicht

### Monatliche Kosten bei verschiedenen User-Zahlen

| Feature | 1K Users | 10K Users | 100K Users |
|---------|----------|-----------|------------|
| Empfehlungen | $10 | $90 | $900 |
| Smart Search | $1 | $10 | $100 |
| Going Solo Matching | $5 | $50 | $500 |
| Photo Analysis | $15 | $150 | $1,500 |
| Chat Features | $2 | $20 | $200 |
| Host Features | $1 | $10 | $100 |
| **GESAMT** | **~$34** | **~$330** | **~$3,300** |

### Optimierungen zur Kosten-Reduktion
1. **Caching:** Empfehlungen nur 1x täglich neu berechnen
2. **Batch-Processing:** Mehrere Anfragen zusammenfassen
3. **Embeddings statt GPT:** Für Matching & Suche günstiger
4. **Lazy Loading:** Features nur bei Bedarf aktivieren
5. **Usage Limits:** Pro User max. X KI-Anfragen/Tag

---

## 🎯 Empfohlene MVP-Features (Start)

### Phase 1 (Sofort implementieren):
1. ✅ **Personalisierte Empfehlungen** (Discover-Page)
2. ✅ **Smart Event Search** (Natural Language)
3. ✅ **Going Solo Matching** (mit Embeddings)

**Kosten:** ~$20-50/Monat bei 1K Usern
**Impact:** 🔥🔥🔥 Sehr hoch

### Phase 2 (Nach 3 Monaten):
4. **Event Memories Analysis** (Vision)
5. **Smart Chat Replies**

**Zusätzliche Kosten:** ~$20-30/Monat
**Impact:** 🔥🔥 Hoch

### Phase 3 (Nach 6 Monaten):
6. **Host Analytics**
7. **Event Description Generator**

**Zusätzliche Kosten:** ~$5-10/Monat
**Impact:** 🔥 Mittel, aber wichtig für B2B

---

## 🛠️ Setup & Dependencies

### Required Packages
```bash
npm install openai @supabase/supabase-js
```

### Environment Variables
```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

### Database Tables Ergänzungen
```sql
-- Für KI-Empfehlungen Tracking
CREATE TABLE ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  recommendations jsonb,
  created_at timestamptz DEFAULT now()
);

-- Für User Embeddings (Performance)
CREATE TABLE user_embeddings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  embedding vector(1536),
  updated_at timestamptz DEFAULT now()
);

-- Für Event Embeddings
CREATE TABLE event_embeddings (
  event_id uuid PRIMARY KEY REFERENCES events(id),
  embedding vector(1536),
  updated_at timestamptz DEFAULT now()
);
```

---

## 📊 Erfolgs-Metriken

### KPIs zum Tracken:
- **Recommendation Click-Through-Rate:** Wie viele empfohlene Events werden angeklickt?
- **Search Success Rate:** Führt Smart Search zu Event-Views?
- **Going Solo Conversion:** Wie viele Matches führen zu Chats/Ticket-Käufen?
- **Memory Upload Rate:** Wie viele User nutzen die Auto-Caption?
- **Host Adoption:** Wie viele Hosts nutzen den Description Generator?

### A/B Testing
Teste jedes Feature mit/ohne KI:
- 50% User bekommen KI-Features
- 50% User bekommen Standard-Features
- Vergleiche Engagement & Conversion

---

## 🚀 Next Steps

1. **OpenAI Account erstellen** und API-Key holen
2. **Erste Experimente** mit Empfehlungen im Development-Mode
3. **Kosten-Monitoring** setup (OpenAI Dashboard)
4. **User-Feedback** sammeln für jedes Feature
5. **Iterativ optimieren** basierend auf Metriken

---

## 📚 Weitere Ressourcen

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Vector/pgvector Guide](https://supabase.com/docs/guides/ai)
- [React Native OpenAI Integration](https://github.com/openai/openai-node)

---

**Erstellt:** 2025-01-14  
**Letzte Aktualisierung:** 2025-01-14  
**Version:** 1.0