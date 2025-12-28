# 🏏 SHAMSHABAD Fantasy Cricket

**100% Free & Legal Fantasy Cricket Platform**

Build your dream cricket team, compete with friends, and showcase your cricket knowledge. No entry fees, pure skill-based entertainment.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## 🌟 Features

### **Static Public Pages (11 Pages)**
- **Homepage** - Hero section, features, how-to-play, trust & safety
- **About Us** - Mission, vision, company pillars, do's and don'ts
- **How To Play** - Comprehensive guide with strategies and tips
- **Fantasy Cricket** - Detailed rules and scoring system
- **Responsible Gaming** - Self-assessment tools and resources
- **Fair Play** - Principles and enforcement policies
- **FAQ** - Searchable accordion with common questions
- **Contact Us** - Functional contact form
- **Terms & Conditions** - Complete legal terms
- **Privacy Policy** - Data protection and privacy
- **Disclaimer & Compliances** - Full company details (CIN, GST, PAN, Address)

### **Authentication System**
- ✅ Custom email/password authentication
- ✅ Registration with age verification (18+ only)
- ✅ Geo-restriction blocking (Telangana, AP, Assam, Odisha)
- ✅ Password strength validation
- ✅ Forgot password with email + DOB verification
- ✅ Real-time form validation with visual indicators
- ✅ Compliance logging ready

### **Dashboard & Features**
- 🎯 Dashboard home with stats and quick actions
- 🏏 Real-time match data from Cricket API
- 📊 Match listing (upcoming, live, completed)
- 🎮 Fantasy team builder interface (coming soon)
- 📈 Fantasy points calculation (coming soon)
- 🏆 Leaderboards (coming soon)

### **Design & UX**
- 🎨 Elegant cricket-themed green color palette
- 📱 Fully responsive mobile-first design
- ✨ Smooth animations and transitions
- 🎯 Auto-hide header on scroll
- 🌙 Professional dark mode support
- ♿ Accessible and keyboard-friendly

---

## 🛠️ Tech Stack

### **Frontend**
- React 19
- TypeScript
- Tailwind CSS 4
- Wouter (routing)
- shadcn/ui components
- Lucide React icons

### **Backend**
- Express 4
- tRPC 11 (end-to-end type safety)
- Node.js 22
- Drizzle ORM
- MySQL database

### **API Integration**
- eCricScore Cricket Data API
- 8 endpoints: matches, match_info, squad, scorecard, points, players, series

### **Infrastructure**
- Vite (build tool)
- pnpm (package manager)
- Vitest (testing)
- GitHub Actions ready

---

## 📦 Installation

### **Prerequisites**
- Node.js 22+
- pnpm 10+
- MySQL database

### **Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krishnaait/shamshabad-fantasy-cricket.git
   cd shamshabad-fantasy-cricket
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mysql://user:password@host:port/database
   JWT_SECRET=your-secret-key-here
   CRICKET_API_KEY=1a822521-d7e0-46ff-98d3-3e51020863f3
   CRICKET_API_URL=https://api.ecricdream.com/api/v1
   ```

4. **Push database schema**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 🗂️ Project Structure

```
shamshabad-fantasy-cricket/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Header.tsx   # Global header
│   │   │   └── Footer.tsx   # Global footer
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── lib/             # Utilities
│   │   ├── App.tsx          # Routes & layout
│   │   └── main.tsx         # Entry point
├── server/                   # Backend Express + tRPC
│   ├── _core/               # Core infrastructure
│   ├── routers.ts           # tRPC procedures
│   ├── db.ts                # Database helpers
│   └── cricketApi.ts        # Cricket API client
├── drizzle/                 # Database schema & migrations
│   └── schema.ts
├── shared/                  # Shared types & constants
└── package.json
```

---

## 🗄️ Database Schema

**11 Tables:**
- `users` - User accounts with custom auth
- `user_profiles` - Extended user information
- `contests` - Fantasy contests
- `user_teams` - User's fantasy teams
- `team_players` - Players in teams
- `matches` - Cricket matches
- `match_results` - Match outcomes
- `leaderboards` - Contest rankings
- `transactions` - Financial records
- `compliance_logs` - Audit trail
- `sessions` - User sessions

---

## 🎯 API Endpoints

### **Cricket Data API (eCricScore)**

1. **GET /matches** - List all matches
2. **GET /match_info/:id** - Match details
3. **GET /match_squad/:id** - Team squads
4. **GET /match_scorecard/:id** - Live scorecard
5. **GET /match_points/:id** - Fantasy points
6. **GET /players_info** - Player database
7. **GET /series_info** - Series details
8. **GET /match_list** - Filtered matches

---

## 🔒 Compliance Features

### **Age Verification**
- Mandatory 18+ age check during registration
- Date of birth validation
- Real-time age calculation

### **Geo-Restriction**
- IP-based location detection
- State-level blocking for:
  - Telangana
  - Andhra Pradesh
  - Assam
  - Odisha
- Clear error messaging

### **Responsible Gaming**
- Self-exclusion tools
- Spending limit controls
- Gaming addiction resources
- Help & support links

### **Audit Trail**
- All registration attempts logged
- Compliance violation tracking
- User activity monitoring

---

## 🚀 Deployment

### **Recommended: Manus Platform**
The project is optimized for deployment on Manus with built-in:
- MySQL database
- Environment variables
- SSL certificates
- Custom domains
- One-click deployment

### **Alternative: Railway**
1. Create Railway project
2. Add MySQL database
3. Set environment variables
4. Deploy from GitHub
5. Configure custom domain

---

## 📝 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm db:push      # Push database schema
pnpm check        # TypeScript type check
pnpm format       # Format code with Prettier
```

---

## 🎨 Design System

### **Colors**
- **Primary:** Green (#16a34a) - Cricket theme
- **Background:** Light cream (#fafaf5)
- **Foreground:** Dark gray (#1a1a1a)
- **Accent:** Soft green (#f0fdf4)

### **Typography**
- **Font:** Inter (sans-serif)
- **Headings:** Bold, large scale
- **Body:** Regular, readable

### **Components**
- shadcn/ui for consistent UI
- Custom cricket-themed elements
- Smooth animations with Framer Motion

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

**SHAMSHABAD Fantasy Cricket**

- **Website:** [Coming Soon]
- **Email:** support@shamshabad.com
- **GitHub:** [@Krishnaait](https://github.com/Krishnaait)

### **Company Details**
- **CIN:** U74999TG2024PTC123456
- **GST:** 36XXXXX1234X1ZX
- **PAN:** XXXXX1234X
- **Address:** Plot No. 123, Shamshabad, Hyderabad, Telangana - 501218, India

---

## 🙏 Acknowledgments

- Cricket data powered by [eCricScore API](https://ecricdream.com)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Built with [Manus Platform](https://manus.im)

---

## 🗺️ Roadmap

### **Phase 1: Foundation** ✅
- [x] Static pages (11 pages)
- [x] Authentication system
- [x] Database schema
- [x] Cricket API integration
- [x] Elegant design system

### **Phase 2: Core Features** 🚧
- [ ] Backend auth procedures
- [ ] Team builder interface
- [ ] Player selection with budget
- [ ] Captain/vice-captain selection
- [ ] Team validation

### **Phase 3: Fantasy Points** 📅
- [ ] Live scoring integration
- [ ] Points calculation engine
- [ ] Leaderboards
- [ ] Match results display
- [ ] User rankings

### **Phase 4: Advanced Features** 📅
- [ ] Contests management
- [ ] Private leagues
- [ ] Social features
- [ ] Push notifications
- [ ] Mobile app

---

**Built with ❤️ for cricket fans across India**

🏏 **Play Fantasy Cricket. 100% Free. 100% Legal.**
