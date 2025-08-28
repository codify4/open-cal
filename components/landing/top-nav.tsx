'use client';

import { Github, Menu, ChevronDown, Rocket, Code, Target, TrendingUp, Globe, Briefcase, Users } from 'lucide-react';
import { DiscordIcon, XIcon } from '@/lib/lucide/custom-icons';
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

export default function TopNav() {
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
    { name: 'Features', href: '/#features' },
    // { name: 'Pricing', href: '/#pricing' },
    { name: 'Roadmap', href: '/roadmap' },
  ];

  const useCases = [
    { name: 'For Founders', href: '/founders', description: 'Scale your startup', icon: Rocket },
    { name: 'For Developers', href: '/developers', description: 'Code more, schedule less', icon: Code },
    { name: 'For Productivity', href: '/productivity', description: 'Optimize your time', icon: Target },
    { name: 'For Sales Teams', href: '/sales', description: 'Close more deals', icon: TrendingUp },
    { name: 'For Freelancers', href: '/freelancers', description: 'Get more clients', icon: Users },
    { name: 'For Consultants', href: '/consultants', description: 'Manage clients efficiently', icon: Briefcase },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`-translate-x-1/2 fixed top-0 left-1/2 z-100 mt-2 w-11/12 sm:w-2/3 self-center rounded-full border border-neutral-800 bg-black transition-all duration-500 ${
        isScrolled ? 'w-2/4 bg-black/80 backdrop-blur-xl' : 'bg-black'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-row items-center justify-center gap-1">
            <Image alt="Caly" height={50} src="/logo-name.svg" width={80} />
          </Link>

          <div className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <Link
                className="font-medium text-neutral-400 text-sm transition-colors hover:text-white"
                href={item.href}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-neutral-400 text-sm bg-transparent hover:bg-transparent transition-colors hover:text-white p-0 mx-0 h-auto cursor-pointer focus:outline-none">
                Use Cases
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[560px] bg-black border-border/30 p-2">
                <div className="grid grid-cols-2 gap-1">
                  {useCases.map((useCase) => (
                    <DropdownMenuItem asChild key={useCase.name} variant='default'>
                      <Link href={useCase.href} className="flex flex-col items-start p-3 hover:!bg-neutral-900 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <useCase.icon className="h-4 w-4 text-neutral-400" />
                          <div className="font-medium text-white">{useCase.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">{useCase.description}</div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <div className="items-center space-x-5 flex">
                <Link href="/github" className="text-white hover:text-white/80 transition-colors">
                    <Github className="h-4 w-4" />
                </Link>
                <Link href="/x" className="text-white hover:text-white/80 transition-colors">
                    <XIcon className="h-4 w-4" />
                </Link>
                <Link href="/discord" className="text-white hover:text-white/80 transition-colors">
                    <DiscordIcon className="h-4 w-4" />
                </Link>
            </div>

            <div className="flex items-center space-x-2 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 w-9" size="icon" variant="ghost">
                    <Menu className="h-5 w-5 text-white focus:ring-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-black border-border/30">
                  {navItems.map((item) => (
                    <DropdownMenuItem asChild key={item.name}>
                      <Link className="font-medium text-white" href={item.href}>
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="font-medium text-white">
                    <div className="flex items-center justify-between w-full">
                      Use Cases
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </DropdownMenuItem>
                  {useCases.map((useCase) => (
                    <DropdownMenuItem asChild key={useCase.name}>
                      <Link className="font-medium text-white pl-6" href={useCase.href}>
                        {useCase.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}