#  TrendWise

**TrendWise** is a full-stack, SEO-optimized blog platform that automatically fetches trending topics from Google/Twitter and generates rich articles using AI (OpenAI/Gemini). It supports Google authentication, user comments, and a beautifully designed blog frontend.



---

##  Features

-  Fetches trending topics from Google Trends & Twitter
-  Generates SEO-optimized blog articles using ChatGPT/Gemini
-  Media-rich content with embedded images, videos, and tweets
-  Google login for user authentication (via NextAuth.js)
-  Commenting system for authenticated users
-  Auto-generated `sitemap.xml` and `robots.txt`
-  Admin interface to trigger content bot manually (optional)

---

##  Tech Stack

| Layer            | Technology                            |
|------------------|----------------------------------------|
| **Frontend**     | Next.js 14+ (App Router)               |
| **Styling**      | TailwindCSS                            |
| **Authentication** | NextAuth.js (Google login)            |
| **Backend**      | Node.js with Express |
| **Database**     | MongoDB                  |
| **ORM**          | Mongoose                               |
| **Hosting**      | Vercel  |

---

##  Functional Modules

### 1. Backend Bot
- Fetches trends from Twitter
- Sends prompts to Gemini API
- Stores:
  - Title
  - Slug
  - Meta description
  - Content
  - Media (images/videos/tweets)

### 2. Blog Frontend
- Homepage: List of articles (thumbnail, title, excerpt)
- Detail Page:
  - Full article view
  - SEO metadata + OG tags
  - Embedded tweets/images
- Search bar to filter articles by keyword

### 3. User Authentication
- Google login using NextAuth.js
- Authenticated users can:
  - Post comments on articles
  - View their own comment history

### 4. AI-Powered Content Generation
- Uses OpenAI or Gemini to generate:
  - Article body
  - H1-H3 headings
  - Meta descriptions
  - OG tags and SEO structure

### 5. SEO Enhancements
- `/sitemap.xml` (dynamic)
- `/robots.txt` with proper indexing rules
- OG metadata for social sharing

### 6. Admin Panel (Optional)
- View articles list
- Manually trigger bot for new trends
- Protected by auth middleware

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/trendwise.git
cd trendwise
npm install
```
### 2.Create a .env.local in the root with:
```bash
# .env.local (Example Configuration)

# === AI / Content Generation ===
GEMINI_API_KEY=your_gemini_api_key


# === MongoDB ===
MONGODB_URI=your_mongodb_connection_string

# === Twitter API ===
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# === Unsplash API ===
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# === Google Auth (NextAuth) ===
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-deployed-url.com

# === App Settings ===
NEXT_PUBLIC_BASE_URL=https://your-frontend-url.com
```
### 3. Run the dev server
```bash
npm run dev
```
