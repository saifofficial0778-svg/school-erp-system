import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
        .lp-body { font-family: 'Inter', sans-serif; background: #0f0a1e; color: #fff; overflow-x: hidden; margin: 0; }
        /* NAV */
        .lp-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 6%; background: rgba(15,10,30,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); position: sticky; top: 0; z-index: 100; }
        .lp-logo { font-size: 1.5rem; font-weight: 900; background: linear-gradient(135deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
        .lp-nav-links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .lp-nav-links a { text-decoration: none; color: rgba(255,255,255,0.6); font-size: 0.88rem; font-weight: 500; transition: color 0.2s; }
        .lp-nav-links a:hover { color: #fff; }
        .lp-nav-btns { display: flex; gap: 0.75rem; }
        .lp-btn-ghost { padding: 0.5rem 1.2rem; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; background: transparent; transition: all 0.2s; }
        .lp-btn-ghost:hover { background: rgba(255,255,255,0.08); }
        .lp-btn-cta { padding: 0.5rem 1.2rem; background: linear-gradient(135deg,#7c3aed,#2563eb); color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .lp-btn-cta:hover { opacity: 0.9; transform: translateY(-1px); }
        /* HERO */
        .lp-hero { padding: 6rem 6% 5rem; display: flex; gap: 4rem; align-items: center; position: relative; overflow: hidden; }
        .lp-hero::before { content: ''; position: absolute; top: -200px; left: -100px; width: 600px; height: 600px; background: radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%); pointer-events: none; }
        .lp-hero-text { flex: 1; position: relative; z-index: 1; }
        .lp-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; font-size: 0.78rem; font-weight: 600; padding: 0.4rem 1rem; border-radius: 20px; margin-bottom: 1.5rem; }
        .lp-hero h1 { font-size: 3.2rem; font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 1.2rem; }
        .lp-grad { background: linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .lp-hero p { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 2rem; max-width: 460px; }
        .lp-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .lp-h-btn-main { padding: 0.9rem 2rem; background: linear-gradient(135deg,#7c3aed,#2563eb); color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .lp-h-btn-main:hover { opacity: 0.9; transform: translateY(-2px); }
        .lp-h-btn-sec { padding: 0.9rem 2rem; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); border-radius: 12px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .lp-hero-stats { display: flex; gap: 2.5rem; }
        .lp-stat-num { font-size: 1.7rem; font-weight: 900; background: linear-gradient(135deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .lp-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 0.15rem; }
        /* DASHBOARD MOCKUP */
        .lp-hero-visual { flex: 1; max-width: 460px; position: relative; z-index: 1; }
        .lp-mock-wrap { background: linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2)); border-radius: 20px; padding: 1.5px; }
        .lp-mock-inner { background: #13102a; border-radius: 20px; padding: 1.2rem; }
        .lp-mock-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .lp-mock-title { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.9); }
        .lp-mock-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
        .lp-mock-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.6rem; margin-bottom: 0.75rem; }
        .lp-m-card { border-radius: 12px; padding: 0.75rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }
        .lp-m-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .lp-m-val { font-size: 1.2rem; font-weight: 800; margin-top: 0.2rem; }
        .lp-purple { color: #a78bfa; } .lp-green { color: #34d399; } .lp-blue { color: #60a5fa; }
        .lp-mock-row { display: flex; gap: 0.6rem; }
        .lp-m-mini { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0.75rem; }
        .lp-m-mini-title { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; text-transform: uppercase; }
        .lp-s-row { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem; }
        .lp-av { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#7c3aed,#2563eb); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; font-weight: 700; color: #fff; }
        .lp-s-name { font-size: 0.65rem; color: rgba(255,255,255,0.7); }
        .lp-s-badge { margin-left: auto; font-size: 0.55rem; padding: 0.1rem 0.35rem; border-radius: 20px; font-weight: 700; }
        .lp-sp { background: rgba(52,211,153,0.15); color: #34d399; }
        .lp-sa { background: rgba(239,68,68,0.15); color: #f87171; }
        .lp-f-row { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .lp-f-n { font-size: 0.65rem; color: rgba(255,255,255,0.6); }
        .lp-f-v { font-size: 0.65rem; font-weight: 700; color: #34d399; }
        .lp-f-p { color: #f87171; }
        /* FEATURES */
        .lp-features { padding: 6rem 6%; background: #0f0a1e; position: relative; }
        .lp-features::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(124,58,237,0.4),transparent); }
        .lp-eyebrow-wrap { text-align: center; margin-bottom: 0.75rem; }
        .lp-eyebrow { display: inline-block; background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25); color: #a78bfa; font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.9rem; border-radius: 20px; }
        .lp-s-title { text-align: center; font-size: 2.2rem; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 0.75rem; }
        .lp-s-sub { text-align: center; color: rgba(255,255,255,0.45); font-size: 0.92rem; margin-bottom: 3rem; }
        .lp-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; }
        .lp-f-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; transition: all 0.3s; }
        .lp-f-card:hover { background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.25); transform: translateY(-3px); }
        .lp-f-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 1rem; border: 1px solid rgba(124,58,237,0.2); }
        .lp-f-title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
        .lp-f-desc { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.6; }
        /* HOW */
        .lp-how { padding: 6rem 6%; background: #0c0920; position: relative; }
        .lp-how::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(96,165,250,0.3),transparent); }
        .lp-steps { display: flex; gap: 0; margin-top: 3.5rem; position: relative; }
        .lp-steps::before { content: ''; position: absolute; top: 28px; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg,rgba(124,58,237,0.4),rgba(37,99,235,0.4)); z-index: 0; }
        .lp-step { flex: 1; text-align: center; position: relative; z-index: 1; padding: 0 1rem; }
        .lp-step-n { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#7c3aed,#2563eb); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900; margin: 0 auto 1rem; border: 3px solid #0c0920; color: #fff; }
        .lp-step-t { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; }
        .lp-step-d { font-size: 0.78rem; color: rgba(255,255,255,0.4); line-height: 1.6; }
        /* PRICING */
        .lp-pricing { padding: 6rem 6%; background: #0f0a1e; position: relative; }
        .lp-pricing::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(124,58,237,0.4),transparent); }
        .lp-price-wrap { max-width: 600px; margin: 3rem auto 0; }
        .lp-p-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(124,58,237,0.3); border-radius: 24px; padding: 2.5rem; text-align: center; position: relative; overflow: hidden; }
        .lp-p-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,#7c3aed,#2563eb,#34d399); }
        .lp-p-top-badge { display: inline-block; background: linear-gradient(135deg,#7c3aed,#2563eb); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.3rem 1rem; border-radius: 20px; margin-bottom: 1.5rem; }
        .lp-p-name { font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .lp-p-price { font-size: 3.5rem; font-weight: 900; background: linear-gradient(135deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -2px; line-height: 1; }
        .lp-p-price span { font-size: 1.2rem; font-weight: 500; color: rgba(255,255,255,0.4); }
        .lp-p-per { font-size: 0.85rem; color: rgba(255,255,255,0.4); margin: 0.5rem 0 0.25rem; }
        .lp-p-students { font-size: 0.82rem; color: #34d399; font-weight: 600; margin-bottom: 2rem; }
        .lp-p-features { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; text-align: left; margin-bottom: 2rem; }
        .lp-p-feat { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: rgba(255,255,255,0.7); }
        .lp-p-feat::before { content: '✓'; color: #34d399; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
        .lp-p-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
        .lp-p-btns { display: flex; gap: 1rem; }
        .lp-p-btn-main { flex: 1; padding: 0.9rem; background: linear-gradient(135deg,#7c3aed,#2563eb); color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
        .lp-p-btn-main:hover { opacity: 0.9; }
        .lp-p-btn-wa { flex: 1; padding: 0.9rem; background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.3); border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
        .lp-p-compare { text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
        /* TRUST */
        .lp-trust { padding: 4rem 6%; background: #0c0920; border-top: 1px solid rgba(255,255,255,0.04); }
        .lp-trust-title { text-align: center; font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2rem; }
        .lp-trust-row { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
        .lp-trust-num { font-size: 1.5rem; font-weight: 900; color: #fff; }
        .lp-trust-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem; }
        /* CTA */
        .lp-cta { padding: 6rem 6%; text-align: center; position: relative; overflow: hidden; }
        .lp-cta::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 400px; background: radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%); pointer-events: none; }
        .lp-cta h2 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 1rem; position: relative; z-index: 1; }
        .lp-cta p { color: rgba(255,255,255,0.5); font-size: 1rem; margin-bottom: 2.5rem; position: relative; z-index: 1; }
        .lp-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
        .lp-c-btn-main { padding: 1rem 2.5rem; background: linear-gradient(135deg,#7c3aed,#2563eb); color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
        .lp-c-btn-main:hover { opacity: 0.9; transform: translateY(-2px); }
        .lp-c-btn-sec { padding: 1rem 2.5rem; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); background: transparent; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; }
        /* FOOTER */
        .lp-footer { background: #080614; padding: 3rem 6% 2rem; border-top: 1px solid rgba(255,255,255,0.04); }
        .lp-footer-top { display: flex; gap: 3rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .lp-footer-logo { font-size: 1.3rem; font-weight: 900; background: linear-gradient(135deg,#a78bfa,#60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.75rem; }
        .lp-footer-tag { font-size: 0.82rem; color: rgba(255,255,255,0.3); line-height: 1.6; }
        .lp-f-col h4 { color: rgba(255,255,255,0.7); font-size: 0.82rem; font-weight: 700; margin-bottom: 0.75rem; }
        .lp-f-col a { display: block; color: rgba(255,255,255,0.3); font-size: 0.78rem; text-decoration: none; margin-bottom: 0.4rem; }
        .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .lp-footer-bottom p { font-size: 0.75rem; color: rgba(255,255,255,0.2); }
        @media(max-width:768px){
          .lp-hero{flex-direction:column;padding:3rem 5%}
          .lp-hero h1{font-size:2.2rem}
          .lp-hero-visual{display:none}
          .lp-feat-grid{grid-template-columns:1fr 1fr}
          .lp-steps{flex-direction:column;gap:1.5rem}
          .lp-steps::before{display:none}
          .lp-nav-links{display:none}
          .lp-p-features{grid-template-columns:1fr}
        }
      `}</style>

            <div className="lp-body">

                {/* NAV */}
                <nav className="lp-nav">
                    <div className="lp-logo">EduTrack</div>
                    <ul className="lp-nav-links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#how">Process</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="lp-nav-btns">
                        <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Login</button>
                        <button className="lp-btn-cta" onClick={() => navigate('/register')}>Free Demo</button> {/* 🔥 /register kar diya */}
                    </div>
                </nav>

                {/* HERO */}
                <section className="lp-hero">
                    <div className="lp-hero-text">
                        <div className="lp-badge">🏫 India ke Schools ka Digital Partner</div>
                        <h1>School chalao<br /><span className="lp-grad">tension nahi</span></h1>
                        <p>Fees, attendance, students — sab kuch ek jagah manage karo. Manual registers band, digital ERP shuru.</p>
                        <div className="lp-hero-btns">
                            <button className="lp-h-btn-main" onClick={() => navigate('/register')}>🚀 Free Demo Shuru Karein</button>
                            <button className="lp-h-btn-sec">▶ Demo Dekhein</button>
                        </div>
                        <div className="lp-hero-stats">
                            <div><div className="lp-stat-num">500+</div><div className="lp-stat-label">Happy Schools</div></div>
                            <div><div className="lp-stat-num">₹1,000</div><div className="lp-stat-label">Per Month Only</div></div>
                            <div><div className="lp-stat-num">24hr</div><div className="lp-stat-label">Free Setup</div></div>
                        </div>
                    </div>

                    <div className="lp-hero-visual">
                        <div className="lp-mock-wrap">
                            <div className="lp-mock-inner">
                                <div className="lp-mock-header">
                                    <div className="lp-mock-title">📊 EduTrack Dashboard</div>
                                    <div className="lp-mock-dot"></div>
                                </div>
                                <div className="lp-mock-metrics">
                                    <div className="lp-m-card"><div className="lp-m-label">Students</div><div className="lp-m-val lp-purple">248</div></div>
                                    <div className="lp-m-card"><div className="lp-m-label">Fees</div><div className="lp-m-val lp-green">₹2.4L</div></div>
                                    <div className="lp-m-card"><div className="lp-m-label">Present</div><div className="lp-m-val lp-blue">94%</div></div>
                                </div>
                                <div className="lp-mock-row">
                                    <div className="lp-m-mini">
                                        <div className="lp-m-mini-title">Attendance</div>
                                        <div className="lp-s-row"><div className="lp-av">AK</div><span className="lp-s-name">Arjun Kumar</span><span className="lp-s-badge lp-sp">P</span></div>
                                        <div className="lp-s-row"><div className="lp-av">PS</div><span className="lp-s-name">Priya Singh</span><span className="lp-s-badge lp-sp">P</span></div>
                                        <div className="lp-s-row"><div className="lp-av">RM</div><span className="lp-s-name">Rahul Mehta</span><span className="lp-s-badge lp-sa">A</span></div>
                                    </div>
                                    <div className="lp-m-mini">
                                        <div className="lp-m-mini-title">Fee Status</div>
                                        <div className="lp-f-row"><span className="lp-f-n">Arjun Kumar</span><span className="lp-f-v">✓ Paid</span></div>
                                        <div className="lp-f-row"><span className="lp-f-n">Priya Singh</span><span className="lp-f-v">✓ Paid</span></div>
                                        <div className="lp-f-row"><span className="lp-f-n">Rahul Mehta</span><span className="lp-f-v lp-f-p">₹2,500</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="lp-features" id="features">
                    <div className="lp-eyebrow-wrap"><span className="lp-eyebrow">✨ Features</span></div>
                    <h2 className="lp-s-title">Sab Kuch Ek Jagah</h2>
                    <p className="lp-s-sub">Manual kaam band karo — EduTrack sab automate karta hai</p>
                    <div className="lp-feat-grid">
                        {[
                            { icon: '👨‍🎓', title: 'Student Management', desc: 'Admission se result tak — har student ka complete record ek click mein.' },
                            { icon: '💰', title: 'Fee Collection', desc: 'Online aur offline fee, auto receipts, defaulters list — sab automatic.' },
                            { icon: '📋', title: 'Attendance System', desc: 'Daily attendance mark karo, monthly reports dekho, parents ko alerts bhejo.' },
                            { icon: '📊', title: 'Analytics Dashboard', desc: 'School ki performance ek nazar mein — fees, attendance, progress charts.' },
                            { icon: '🏫', title: 'Multi-School Support', desc: 'Ek se zyada branches? Sab ek account se manage karo — alag alag data.' },
                            { icon: '🔒', title: 'Secure & Private', desc: 'Har school ka data bilkul alag — complete privacy aur security ke saath.' },
                        ].map((f, i) => (
                            <div className="lp-f-card" key={i}>
                                <div className="lp-f-icon">{f.icon}</div>
                                <div className="lp-f-title">{f.title}</div>
                                <div className="lp-f-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="lp-how" id="how">
                    <div className="lp-eyebrow-wrap"><span className="lp-eyebrow">⚡ Process</span></div>
                    <h2 className="lp-s-title">Shuru Karna Bahut Aasaan</h2>
                    <p className="lp-s-sub">Sirf 4 steps mein apna school digital karo</p>
                    <div className="lp-steps">
                        {[
                            { n: '1', t: 'Register Karein', d: 'School ka account banao — 2 minute mein ready' },
                            { n: '2', t: 'Setup Karein', d: 'Classes aur students add karo — easy form' },
                            { n: '3', t: 'Use Karein', d: 'Fee, attendance sab manage karo daily' },
                            { n: '4', t: 'Grow Karein', d: 'Time bachao, school ko aage badhao' },
                        ].map((s, i) => (
                            <div className="lp-step" key={i}>
                                <div className="lp-step-n">{s.n}</div>
                                <div className="lp-step-t">{s.t}</div>
                                <div className="lp-step-d">{s.d}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PRICING */}
                <section className="lp-pricing" id="pricing">
                    <div className="lp-eyebrow-wrap"><span className="lp-eyebrow">💎 Pricing</span></div>
                    <h2 className="lp-s-title">Ek Plan — Sab Kuch Included</h2>
                    <p className="lp-s-sub">Koi hidden charges nahi — jo dikhe wahi pay karo</p>
                    <div className="lp-price-wrap">
                        <div className="lp-p-card">
                            <div className="lp-p-top-badge">⭐ All-in-One Plan</div>
                            <div className="lp-p-name">EduTrack Standard</div>
                            <div className="lp-p-price">₹1,000 <span>/month</span></div>
                            <div className="lp-p-per">= ₹12,000/year — sabse affordable</div>
                            <div className="lp-p-students">✓ 3,000 Students tak — price same rahegi</div>
                            <div className="lp-p-features">
                                {['Unlimited Students (3000 tak)', 'Fee Management', 'Attendance System', 'Monthly Reports', 'Analytics Dashboard', 'Multi-School Support', 'Student Login Portal', 'Free Setup (24hr)', 'WhatsApp Support', '15 Din Free Trial'].map((f, i) => (
                                    <div className="lp-p-feat" key={i}>{f}</div>
                                ))}
                            </div>
                            <div className="lp-p-divider"></div>
                            <div className="lp-p-btns">
                                <button className="lp-p-btn-main" onClick={() => navigate('/login')}>🚀 Free Trial Shuru Karein</button>
                                <button className="lp-p-btn-wa">💬 WhatsApp Karein</button>
                            </div>
                        </div>
                        <div className="lp-p-compare">
                            vs Fedena <span style={{ color: '#f87171' }}>₹40,000+</span> | Entab <span style={{ color: '#f87171' }}>₹35,000+</span> | EduTrack sirf <span style={{ color: '#34d399' }}>₹12,000/year</span>
                        </div>
                    </div>
                </section>

                {/* TRUST */}
                <section className="lp-trust">
                    <div className="lp-trust-title">Schools ki pasand</div>
                    <div className="lp-trust-row">
                        {[['500+', 'Schools'], ['50,000+', 'Students Managed'], ['₹2Cr+', 'Fees Collected'], ['4.9★', 'Rating'], ['15 Din', 'Free Trial']].map(([n, l], i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div className="lp-trust-num">{n}</div>
                                <div className="lp-trust-label">{l}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="lp-cta" id="contact">
                    <h2>Aaj Hi <span className="lp-grad">Digital Bano</span><br />Free Mein!</h2>
                    <p>15 din ka free trial — koi credit card nahi chahiye</p>
                    <div className="lp-cta-btns">
                        <button className="lp-c-btn-main" onClick={() => navigate('/login')}>🚀 Free Trial Shuru Karein</button>
                        <button className="lp-c-btn-sec">📞 Demo Book Karein</button>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="lp-footer">
                    <div className="lp-footer-top">
                        <div style={{ flex: 2 }}>
                            <div className="lp-footer-logo">EduTrack</div>
                            <div className="lp-footer-tag">India ke schools ke liye sabse affordable<br />aur easy-to-use School ERP system.</div>
                        </div>
                        {[['Product', ['Features', 'Pricing', 'Demo', 'Updates']], ['Support', ['Help Center', 'Contact', 'WhatsApp']], ['Company', ['About', 'Blog', 'Privacy', 'Terms']]].map(([title, links], i) => (
                            <div className="lp-f-col" key={i}>
                                <h4>{title}</h4>
                                {links.map((l, j) => <a href="#" key={j}>{l}</a>)}
                            </div>
                        ))}
                    </div>
                    <div className="lp-footer-bottom">
                        <p>© 2026 EduTrack. All rights reserved.</p>
                        <p>Made with ❤️ for Indian Schools</p>
                    </div>
                </footer>

            </div>
        </>
    );
};

export default LandingPage;