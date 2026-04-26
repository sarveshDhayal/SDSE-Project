import { Component } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {
  LayoutDashboard, Receipt, PieChart, BarChart3,
  Bell, Sun, Moon, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { AIAssistant } from './components/AIAssistant';

const apiClient = axios.create({ baseURL: 'http://localhost:3001/api' });
const DEMO_USER_ID = "1";

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Home',         icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt         },
  { id: 'budgets',      label: 'Budget',       icon: PieChart        },
  { id: 'reports',      label: 'Reports',      icon: BarChart3       },
];

// ── Mobile Bottom Nav ───────────────────────────────
function BottomNav(props: any) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)] border-t border-[var(--border-color)] safe-area-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(function(item) {
          let isActive = props.active == item.id;
          let Icon = item.icon;
          
          return (
            <button key={item.id} onClick={() => props.onNav(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${isActive ? 'text-[var(--brand-accent)]' : 'text-[var(--text-muted)]'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── Desktop Sidebar (fallback/legacy) ───────────────
function Sidebar(props: any) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] z-40">
      <div className="px-6 py-8 bg-[var(--brand-primary)] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)] flex items-center justify-center font-black text-[var(--brand-primary)] text-sm shadow-sm">FA</div>
          <h2 className="font-bold text-white text-xl tracking-tight">FinAura</h2>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(function(item) {
          let isActive = props.active == item.id;
          let Icon = item.icon;
          return (
            <button key={item.id} onClick={() => props.onNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[var(--brand-primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-black/5'}`}>
              <Icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <button onClick={props.onLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--accent-danger)] text-white font-black text-xs uppercase tracking-widest shadow-sm hover:opacity-90 transition-opacity">
          <LogOut size={16} /> SIGN OUT
        </button>
      </div>
    </aside>
  );
}

// ── Top Header ────────────────────────────────────────
function TopHeader(props: any) {
  const date = props.viewDate || new Date();
  
  const handlePrev = () => {
    const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    props.onDateChange(prev);
  };
  
  const handleNext = () => {
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    props.onDateChange(next);
  };

  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return (
    <header className="sticky top-0 z-30 bg-[var(--brand-primary)] px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-full text-white">
        <div className="flex-1 flex justify-start">
          <button onClick={props.onMenuOpen} className="lg:hidden p-1">
            <Menu size={24} />
          </button>
          <button onClick={props.toggleTheme} className="hidden lg:block p-1">
            {props.theme == 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Current Month</span>
          <div className="flex items-center gap-4">
            <button onClick={handlePrev} className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div className="flex items-center gap-1.5 min-w-[120px] justify-center">
              <span className="font-extrabold text-lg tracking-tight whitespace-nowrap">{monthName} {year}</span>
            </div>
            <button onClick={handleNext} className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Logged in as</span>
            <span className="text-xs font-black tracking-tight">{props.userContext?.name || 'User'}</span>
          </div>
          
          <button onClick={props.toggleTheme} className="p-1.5 hover:bg-white/10 rounded-xl transition-all">
             {props.theme == 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button onClick={props.onLogout} className="flex items-center gap-2 p-1.5 px-3 bg-white/10 hover:bg-[var(--accent-danger)] rounded-xl transition-all text-white font-bold text-[10px] uppercase tracking-widest">
            <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Mobile Drawer (tablet only) ───────────────────────
function MobileDrawer(props: any) {
  return (
    <>
      {props.isOpen && <div className="fixed inset-0 z-50 bg-black/40" onClick={props.onClose} />}
      <div className={`fixed top-0 left-0 h-full z-50 w-72 bg-[var(--bg-primary)] shadow-2xl transform transition-transform duration-300 ${props.isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-[var(--brand-primary)] flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)] flex items-center justify-center font-black text-[var(--brand-primary)] text-sm">FA</div>
            <span className="font-bold text-xl tracking-tight">FinAura</span>
          </div>
          <button onClick={props.onClose} className="p-1"><X size={24} /></button>
        </div>
        <nav className="px-3 py-6 space-y-2">
          {NAV_ITEMS.map(function(item) {
            let isActive = props.active == item.id;
            let Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { props.onNav(item.id); props.onClose(); }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-sm font-bold ${isActive ? 'bg-[var(--brand-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-black/5'}`}>
                <Icon size={22} />{item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// ── Login Screen ─────────────────────────────────────
function LoginScreen(props: any) {
  let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-secondary)] px-4">
        <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] overflow-hidden border border-[var(--border-color)]">
          <div className="bg-[var(--brand-primary)] p-12 flex flex-col items-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-accent)] flex items-center justify-center font-black text-[var(--brand-primary)] text-2xl shadow-lg mb-4">FA</div>
            <h1 className="text-4xl font-black tracking-tight">FinAura</h1>
            <p className="font-bold opacity-60 text-[10px] uppercase tracking-[0.2em] mt-1">Premium Finance Manager</p>
          </div>

          <div className="p-8">
            <div className="flex gap-4 mb-8">
              <button onClick={() => props.setIsLoginMode(true)} className={`flex-1 pb-2 font-black text-xs tracking-widest transition-all ${props.isLoginMode ? 'text-[var(--brand-primary)] border-b-4 border-[var(--brand-accent)]' : 'text-[var(--text-muted)]'}`}>SIGN IN</button>
              <button onClick={() => props.setIsLoginMode(false)} className={`flex-1 pb-2 font-black text-xs tracking-widest transition-all ${!props.isLoginMode ? 'text-[var(--brand-primary)] border-b-4 border-[var(--brand-accent)]' : 'text-[var(--text-muted)]'}`}>SIGN UP</button>
            </div>

            <form onSubmit={props.onStandardAuth} className="space-y-5">
              {!props.isLoginMode && (
                <input required placeholder="FULL NAME" className="w-full bg-[var(--bg-secondary)] border-0 border-b-2 border-[var(--border-color)] px-2 py-3 font-bold text-sm focus:border-[var(--brand-accent)] outline-none" />
              )}
              <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-[var(--bg-secondary)] border-0 border-b-2 border-[var(--border-color)] px-2 py-3 font-bold text-sm focus:border-[var(--brand-accent)] outline-none" />
              <input required type="password" placeholder="PASSWORD" className="w-full bg-[var(--bg-secondary)] border-0 border-b-2 border-[var(--border-color)] px-2 py-3 font-bold text-sm focus:border-[var(--brand-accent)] outline-none" />
              
              <button type="submit" className="w-full bg-[var(--brand-primary)] text-white py-4 rounded-xl font-black shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-all uppercase tracking-[0.2em] text-sm">
                {props.isLoginMode ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              {clientId && !clientId.includes('dummy') && !clientId.includes('your_google_client_id_here') ? (
                <GoogleLogin
                  onSuccess={props.onGoogleSuccess}
                  onError={() => props.onStandardAuth({ preventDefault: () => {} } as any)}
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              ) : (
                <div className="text-xs p-3 rounded-lg border border-[var(--accent-danger)]/30 bg-[var(--accent-danger)]/5 text-[var(--accent-danger)] font-bold w-full text-center">
                  Google Auth requires VITE_GOOGLE_CLIENT_ID in .env
                </div>
              )}
              <button onClick={(e) => { e.preventDefault(); props.onStandardAuth(e); }} className="w-full py-4 rounded-xl border-2 border-[var(--border-color)] text-sm font-black text-[var(--text-primary)] uppercase tracking-widest hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] transition-all">
                Enter as Demo User
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

interface AppProps {}

interface AppState {
  activeRoute: string;
  isAuthenticated: boolean;
  userContext: any;
  theme: 'light' | 'dark';
  isLoginMode: boolean;
  drawerOpen: boolean;
  viewDate: Date;
}

// ── Root App (Class Refactor) ───────────────────────────
export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      activeRoute: 'dashboard',
      isAuthenticated: false,
      userContext: null,
      theme: 'dark',
      isLoginMode: true,
      drawerOpen: false,
      viewDate: new Date()
    };
    
    // Bindings
    this.toggleTheme = this.toggleTheme.bind(this);
    this.handleStandardAuth = this.handleStandardAuth.bind(this);
    this.handleGoogleSuccess = this.handleGoogleSuccess.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setActiveRoute = this.setActiveRoute.bind(this);
    this.setDrawerOpen = this.setDrawerOpen.bind(this);
    this.setViewDate = this.setViewDate.bind(this);
    this.setIsLoginMode = this.setIsLoginMode.bind(this);
  }

  componentDidMount() {
    document.body.setAttribute('data-theme', this.state.theme);
    const token = localStorage.getItem('appToken');
    const savedUser = localStorage.getItem('userContext');
    
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      let context = { name: 'Demo User', id: DEMO_USER_ID };
      if (savedUser) {
        try {
          context = JSON.parse(savedUser);
        } catch (e) {}
      }
      this.setState({ 
        isAuthenticated: true,
        userContext: context
      });
    }
  }

  toggleTheme() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: next }, () => {
      document.body.setAttribute('data-theme', next);
    });
  }

  handleStandardAuth(e: any) {
    if (e) e.preventDefault();
    this.setState({
      isAuthenticated: true,
      userContext: { name: 'Demo User', id: DEMO_USER_ID }
    });
  }

  async handleGoogleSuccess(cred: any) {
    try {
      const { data } = await apiClient.post('/auth/google', { idToken: cred.credential });
      localStorage.setItem('appToken', data.token);
      localStorage.setItem('userContext', JSON.stringify(data.user));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      this.setState({ userContext: data.user, isAuthenticated: true });
    } catch {
      this.setState({ 
        userContext: { name: 'Demo User', id: DEMO_USER_ID },
        isAuthenticated: true 
      });
    }
  }

  handleLogout() {
    localStorage.removeItem('appToken');
    localStorage.removeItem('userContext');
    this.setState({ isAuthenticated: false, userContext: null });
  }

  setActiveRoute(route: string) {
    this.setState({ activeRoute: route });
  }

  setDrawerOpen(isOpen: boolean) {
    this.setState({ drawerOpen: isOpen });
  }

  setViewDate(date: Date) {
    this.setState({ viewDate: date });
  }

  setIsLoginMode(isLogin: boolean) {
    this.setState({ isLoginMode: isLogin });
  }

  renderPage() {
    const { activeRoute, viewDate, userContext } = this.state;
    const currentUserId = userContext?.id || DEMO_USER_ID;

    if (activeRoute == 'dashboard') {
      return <Dashboard userId={currentUserId} viewDate={viewDate} />;
    } else if (activeRoute == 'transactions') {
      return <Transactions userId={currentUserId} viewDate={viewDate} />;
    } else if (activeRoute == 'budgets') {
      return <Budgets userId={currentUserId} viewDate={viewDate} />;
    } else if (activeRoute == 'reports') {
      return <Reports userId={currentUserId} viewDate={viewDate} />;
    } else {
      return <Dashboard userId={currentUserId} viewDate={viewDate} />;
    }
  }

  render() {
    const { isAuthenticated, theme, isLoginMode, userContext, activeRoute, drawerOpen, viewDate } = this.state;

    if (!isAuthenticated) {
      return (
        <LoginScreen
          theme={theme} 
          toggleTheme={this.toggleTheme}
          isLoginMode={isLoginMode} 
          setIsLoginMode={this.setIsLoginMode}
          onStandardAuth={this.handleStandardAuth}
          onGoogleSuccess={this.handleGoogleSuccess}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Desktop Sidebar */}
        <Sidebar active={activeRoute} onNav={this.setActiveRoute} userContext={userContext} onLogout={this.handleLogout} />

        {/* Tablet Drawer */}
        <MobileDrawer
          isOpen={drawerOpen} onClose={() => this.setDrawerOpen(false)}
          active={activeRoute} onNav={this.setActiveRoute} onLogout={this.handleLogout}
        />

        {/* Main content — offset by sidebar on desktop */}
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <TopHeader
            tab={activeRoute} userContext={userContext}
            theme={theme} toggleTheme={this.toggleTheme}
            onLogout={this.handleLogout} onMenuOpen={() => this.setDrawerOpen(true)}
            viewDate={viewDate} onDateChange={this.setViewDate}
          />

          {/* Page Content — responsive max-width */}
          <main className="flex-1 px-4 pt-4 pb-20 mx-auto w-full max-w-lg lg:max-w-4xl">
            {this.renderPage()}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav active={activeRoute} onNav={this.setActiveRoute} />

        {/* Aura AI Assistant */}
        <AIAssistant userId={userContext?.id || DEMO_USER_ID} />
      </div>
    );
  }
}
