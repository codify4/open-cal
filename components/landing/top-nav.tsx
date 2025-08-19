'use client';

import { ChevronDown, Github, Menu } from 'lucide-react';
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
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Roadmap', href: '/roadmap' },
  ];

  const useCases = [
    {
      name: 'For Founders',
      href: '/founders',
      description: 'Scale your startup',
    },
    {
      name: 'For Developers',
      href: '/developers',
      description: 'Code more, schedule less',
    },
    {
      name: 'For Productivity',
      href: '/productivity',
      description: 'Optimize your time',
    },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`-translate-x-1/2 fixed top-0 left-1/2 z-50 mt-2 w-11/12 self-center rounded-full border border-neutral-800 bg-black transition-all duration-500 sm:w-2/3 ${
        isScrolled ? 'w-2/4 bg-black/80 backdrop-blur-xl' : 'bg-black'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            className="flex flex-row items-center justify-center gap-1"
            href="/"
          >
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
              <DropdownMenuTrigger className="mx-0 flex h-auto cursor-pointer items-center gap-1 bg-transparent p-0 font-medium text-muted-foreground text-sm transition-colors hover:bg-transparent hover:text-white">
                Use Cases
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[280px] border-border bg-black"
              >
                {useCases.map((useCase) => (
                  <DropdownMenuItem asChild key={useCase.name}>
                    <Link
                      className="flex cursor-pointer flex-col items-start p-3 hover:bg-muted/20"
                      href={useCase.href}
                    >
                      <div className="font-medium text-white">
                        {useCase.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {useCase.description}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link href="/github" target="_blank">
                <Button className="h-9 bg-white px-6 text-black hover:bg-white/90">
                  <Github className="h-4 w-4" fill="black" />
                  GitHub
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-2 lg:hidden">
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
                  <DropdownMenuItem className="font-medium text-white">
                    <div className="flex w-full items-center justify-between">
                      Use Cases
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </DropdownMenuItem>
                  {useCases.map((useCase) => (
                    <DropdownMenuItem asChild key={useCase.name}>
                      <Link
                        className="pl-6 font-medium text-white"
                        href={useCase.href}
                      >
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
