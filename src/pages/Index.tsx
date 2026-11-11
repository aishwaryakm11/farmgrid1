import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/common/AppLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ROLES } from '@/lib/constants';
import {
  ShieldCheck,
  CalendarCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Tractor,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

export const IndexPage: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLaunchPortal = (role: 'farmer' | 'owner' | 'admin') => {
    switchRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-farm-sand flex flex-col selection:bg-farm-sage selection:text-farm-green-dark">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <AppLogo showTagline={true} />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#problem-solution" className="hover:text-foreground transition-colors">
            Why FarmGrid
          </a>
          <a href="#benefits" className="hover:text-foreground transition-colors">
            Core Principles
          </a>
          <a href="#portals" className="hover:text-foreground transition-colors">
            Portals
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLaunchPortal(ROLES.FARMER)}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => handleLaunchPortal(ROLES.FARMER)}
            className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-8 text-center bg-gradient-to-b from-farm-sage/30 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-farm-sage border border-farm-sage-dark/30 text-farm-green-dark text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-farm-green" />
            <span>Agricultural Resource Coordination Under Scarcity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-farm-charcoal leading-tight">
            Share agricultural resources. <br className="hidden sm:inline" />
            <span className="text-farm-green">Schedule them fairly.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            FarmGrid connects farmers and equipment owners to coordinate scarce harvesters, tractors, and irrigation pumps. When demand peaks, our transparent 6-factor priority engine allocates equipment based on urgency and crop risk—without accidental double-booking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => handleLaunchPortal(ROLES.FARMER)}
              className="bg-farm-green hover:bg-farm-green-dark text-white shadow-md font-semibold text-base px-6 h-12"
            >
              Enter Farmer Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleLaunchPortal(ROLES.OWNER)}
              className="border-farm-green/30 hover:bg-farm-sage/50 text-foreground text-base px-6 h-12"
            >
              List Equipment as Owner
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => handleLaunchPortal(ROLES.ADMIN)}
              className="text-xs text-muted-foreground hover:text-foreground h-12 px-3"
            >
              Admin Dashboard →
            </Button>
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Allocation</span>
              <p className="text-base font-bold text-farm-green mt-0.5">100% Deterministic</p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Scoring</span>
              <p className="text-base font-bold text-farm-green mt-0.5">6 Visible Factors</p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Double-Booking</span>
              <p className="text-base font-bold text-farm-green mt-0.5">Strictly Prevented</p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Decisions</span>
              <p className="text-base font-bold text-farm-green mt-0.5">Plain-Language Why</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-16 px-4 sm:px-8 border-y border-border/80 bg-card/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-farm-green mb-1">
              The Agricultural Dilemma
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why First-Come, First-Served Fails Farmers
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <Card className="border-rose-200 bg-rose-50/30">
              <CardHeader>
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Problem: Manual & Uncoordinated Renting</span>
                </div>
                <CardTitle className="text-xl mt-1 text-rose-950">
                  Crops spoil while idle equipment sits booked
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-rose-900/80">
                <p>• <strong>Peak harvest windows:</strong> Farmers simultaneously need harvesters within tight 48-hour windows before rains or over-ripening.</p>
                <p>• <strong>First-come bias:</strong> A farmer with non-urgent vegetative crops can block a harvester needed immediately by a harvest-ready neighbor.</p>
                <p>• <strong>Accidental double-booking:</strong> Offline phone calls and disorganized calendars lead to overlapping commitments.</p>
                <p>• <strong>Opaque rejections:</strong> Farmers are denied equipment with no explanation or suggested alternative.</p>
              </CardContent>
            </Card>

            {/* The FarmGrid Solution */}
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader>
                <div className="flex items-center gap-2 text-farm-green font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The FarmGrid Solution: Coordination Under Scarcity</span>
                </div>
                <CardTitle className="text-xl mt-1 text-emerald-950">
                  Fair, feasible, and transparent scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-emerald-900/80">
                <p>• <strong>Urgency-driven priority:</strong> 6 visible criteria balance crop stage, weather threat, wait time, and proximity.</p>
                <p>• <strong>Strict non-overlapping slots:</strong> Algorithm enforces buffer and transit times, guaranteeing zero double-bookings.</p>
                <p>• <strong>Explainable decisions:</strong> Every farmer sees their full score breakdown and a plain-English explanation.</p>
                <p>• <strong>Disruption contingency:</strong> When a machine breaks down, the platform triggers reallocation or clean rescheduling.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How FarmGrid Works Strip */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-farm-green mb-1">
              Simple 3-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              How FarmGrid Works
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-farm-green text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">Farmer Requests</h4>
              <p className="text-sm text-muted-foreground">
                Farmer submits required machine type, window, crop stage (e.g. peak ripening), and urgency reason.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-farm-green text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">FarmGrid Allocates</h4>
              <p className="text-sm text-muted-foreground">
                Engine evaluates compatible active resources, calculates deterministic priority scores (0–100), and assigns slots.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-farm-green text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">Owner Provides</h4>
              <p className="text-sm text-muted-foreground">
                Resource owner receives a conflict-free master schedule with transit buffers and logs machine availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Concise Benefit Cards */}
      <section id="benefits" className="py-16 px-4 sm:px-8 bg-card/60 border-t border-border/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-farm-green mb-1">
              System Principles
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Designed for Practical Agricultural Reality
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-farm-green/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-farm-sage flex items-center justify-center text-farm-green mb-2">
                  <Scale className="w-5 h-5" />
                </div>
                <CardTitle>Fair Priority</CardTitle>
                <CardDescription>
                  Scores requests using urgency (25), weather risk (25), crop stage (20), waiting time (15), logistics (10), and constraints (5).
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Transparent rules ensure high-risk harvest deadlines are prioritized fairly over routine tasks.
              </CardContent>
            </Card>

            <Card className="hover:border-farm-green/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-farm-sage flex items-center justify-center text-farm-green mb-2">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <CardTitle>Conflict-Free Scheduling</CardTitle>
                <CardDescription>
                  Strict half-open interval checks ensure no physical unit is assigned overlapping bookings.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Includes road travel transit allowances and maintenance buffers between farm shifts.
              </CardContent>
            </Card>

            <Card className="hover:border-farm-green/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-farm-sage flex items-center justify-center text-farm-green mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle>Clear Decisions</CardTitle>
                <CardDescription>
                  Every allocation outcome includes an itemized score sheet and a human-readable explanation.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Farmers see exactly why their request was prioritized or why they are scheduled for the next feasible slot.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Portals Quick Selector */}
      <section id="portals" className="py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-farm-green mb-1">
            Role Navigation
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Select Your Role to Explore the Prototype
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            Each role accesses dedicated tools tailored for their responsibilities.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div
              onClick={() => handleLaunchPortal(ROLES.FARMER)}
              className="p-5 rounded-lg border border-border bg-card hover:border-farm-green cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-farm-green">
                <Users className="w-4 h-4" />
                <span>Farmer</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Submit crop requests, check priority scores, review scheduled slots and booking status.
              </p>
              <span className="text-xs font-semibold text-farm-green inline-flex items-center gap-1">
                Enter Farmer Portal →
              </span>
            </div>

            <div
              onClick={() => handleLaunchPortal(ROLES.OWNER)}
              className="p-5 rounded-lg border border-border bg-card hover:border-farm-green cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-farm-green">
                <Tractor className="w-4 h-4" />
                <span>Resource Owner</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Register harvesters and tractors, inspect master bookings calendar, report machine breakdowns.
              </p>
              <span className="text-xs font-semibold text-farm-green inline-flex items-center gap-1">
                Enter Owner Portal →
              </span>
            </div>

            <div
              onClick={() => handleLaunchPortal(ROLES.ADMIN)}
              className="p-5 rounded-lg border border-border bg-card hover:border-farm-green cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-farm-green">
                <Compass className="w-4 h-4" />
                <span>Administrator</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Inspect system queue, run deterministic allocation passes, view conflicts and audit trails.
              </p>
              <span className="text-xs font-semibold text-farm-green inline-flex items-center gap-1">
                Enter Admin Portal →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-8 bg-farm-green text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Ready to experience fair resource coordination?
          </h3>
          <p className="text-white/80 text-sm">
            Try the demo scenarios to observe how FarmGrid scores urgency, resolves conflicts, and prevents double-booking.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={() => handleLaunchPortal(ROLES.FARMER)}
              className="bg-white text-farm-green-dark hover:bg-farm-sage font-bold px-8"
            >
              Start Demonstration
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 px-4 sm:px-8 text-xs text-muted-foreground text-center">
        <p className="font-semibold text-foreground">FarmGrid — Agricultural Resource Coordination Platform</p>
        <p className="mt-1">
          Hackathon Prototype Specification • Developed with React, TypeScript & Tailwind CSS
        </p>
      </footer>
    </div>
  );
};
