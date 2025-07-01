'use client';

import Link from 'next/link';
import { TrendingUp, Mail, CircleUser , Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Brand Section */}
         <div className="space-y-4">
  <div className="flex items-center space-x-2">
    <TrendingUp className="h-6 w-6 text-primary" />
    <span className="text-xl font-bold">TrendWise</span>
  </div>

  <p className="text-sm text-muted-foreground">
    Discover trending topics and AI-generated insights on technology, business, and innovation.
  </p>

  <div className="flex space-x-2">
    <a
      href="https://robinsam.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Twitter"
    >
      <Button variant="ghost" size="sm">
        <CircleUser  className="h-4 w-4" />
      </Button>
    </a>

    <a
      href="https://github.com/robinsamuelkutty"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
    >
      <Button variant="ghost" size="sm">
        <Github className="h-4 w-4" />
      </Button>
    </a>

    <a
      href="https://linkedin.com/in/robinsamuelkutty"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
    >
      <Button variant="ghost" size="sm">
        <Linkedin className="h-4 w-4" />
      </Button>
    </a>
  </div>
</div>


          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest trending articles delivered to your inbox.
            </p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button type="submit" size="sm" aria-label="Subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 TrendWise. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
