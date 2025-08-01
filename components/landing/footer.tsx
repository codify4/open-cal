import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { XIcon } from '@/lib/lucide/custom-icons';

interface FooterLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface FooterSection {
  title?: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  className?: string;
}

function FooterLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-3 flex items-center space-x-3">
        <Image alt="Logo" height={50} src="/logo-oc.svg" width={120} />
      </div>
      <p className="mb-3 max-w-md text-muted-foreground leading-relaxed">
        An Open Source AI alternative to Google Calendar.
      </p>
    </div>
  );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-5 text-muted-foreground text-sm">
      {links.map((link, index) => (
        <Link
          key={index}
          className="flex items-center gap-2 py-2 transition-colors hover:text-white"
          href={link.href}
        >
          {link.icon}
          <span className="hover:underline">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}

function FooterSection({ section }: { section: FooterSection }) {
  return (
    <div className="flex flex-col items-center space-y-3">
      {section.title && (
        <h3 className="text-sm font-semibold text-white">{section.title}</h3>
      )}
      <FooterLinks links={section.links} />
    </div>
  );
}

function FooterCopyright() {
  return (
    <div className="flex flex-col items-center border-border border-t pt-6 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Digit. All rights reserved.
      </p>
    </div>
  );
}

const defaultSocialLinks: FooterLink[] = [
  {
    href: '/github',
    icon: <Github className="h-4 w-4 text-white" />,
    label: 'GitHub',
  },
  {
    href: '/x',
    icon: <XIcon className="h-4 w-4 text-white" />,
    label: 'X(Twitter)',
  },
];

export function Footer({ sections = [], className = '' }: FooterProps) {
  const allSections = sections.length > 0 ? sections : [
    {
      links: defaultSocialLinks,
    },
  ];

  return (
    <footer className={`flex items-center justify-center border-border/10 border-t bg-black ${className}`}>
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-16 lg:px-8">
        <FooterLogo />
        
        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
          {allSections.map((section, index) => (
            <FooterSection key={index} section={section} />
          ))}
        </div>
        
        <FooterCopyright />
      </div>
    </footer>
  );
}
