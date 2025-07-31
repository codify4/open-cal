'use client';

import { Github, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopNav({ className }: { className?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'Blog', href: '/blog' },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`-translate-x-1/2 fixed top-0 left-1/2 z-50 mt-2 w-2/3 self-center rounded-full border border-border bg-black transition-all duration-500 ${
        isScrolled ? 'w-2/4 bg-black/80 backdrop-blur-xl' : 'bg-black'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-1">
            <Image alt="OpenCal" height={50} src="/logo-oc.svg" width={100} />
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-white"
                href={item.href}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <Link href="/github" target="_blank">
              <Button className="h-9 bg-white px-6 text-black hover:bg-white/90">
                <Github className="h-4 w-4" fill="black" />
                GitHub
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-9 w-9" size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-black">
                {navItems.map((item) => (
                  <DropdownMenuItem asChild key={item.name}>
                    <Link className="font-medium text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
