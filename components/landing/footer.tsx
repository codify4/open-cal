import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DiscordIcon, XIcon } from '@/lib/lucide/custom-icons';

interface FooterLink {
  href: string;
  icon?: React.ReactNode;
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

function FooterBrand() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <Image alt="Logo" height={50} src="/logo-name.svg" width={100} />
      </div>
      <p className="max-w-sm text-muted-foreground leading-relaxed">
        The open source AI calendar that gets the job done. Simple, powerful,
        and works on any platform.
      </p>
      <div className="flex items-center space-x-4">
        <Link
          className="text-muted-foreground transition-colors hover:text-white"
          href="/github"
        >
          <Github className="h-5 w-5" />
        </Link>
        <Link
          className="text-muted-foreground transition-colors hover:text-white"
          href="/x"
        >
          <XIcon className="h-5 w-5" />
        </Link>
        <Link
          className="text-muted-foreground transition-colors hover:text-white"
          href="/discord"
        >
          <DiscordIcon className="h-5 w-5" />
        </Link>
      </div>
      <FooterCopyright />
    </div>
  );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className="flex flex-col space-y-2">
      {links.map((link, index) => (
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-white"
          href={link.href}
          key={index}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function FooterSection({ section }: { section: FooterSection }) {
  return (
    <div className="flex flex-col space-y-3">
      {section.title && (
        <h3 className="font-semibold text-sm text-white">{section.title}</h3>
      )}
      <FooterLinks links={section.links} />
    </div>
  );
}

function FooterCopyright() {
  return (
    <div className="text-muted-foreground text-sm">
      © {new Date().getFullYear()} Caly, All Rights Reserved.
    </div>
  );
}

const resourcesLinks: FooterLink[] = [
  {
    href: '/roadmap',
    label: 'Roadmap',
  },
  {
    href: '/privacy',
    label: 'Privacy policy',
  },
  {
    href: '/terms',
    label: 'Terms of use',
  },
  {
    href: '/github',
    label: 'Repository',
  },
];
export function Footer({ sections = [], className = '' }: FooterProps) {
  return (
    <footer
      className={`flex items-center justify-center border-border/40 border-t bg-black p-10 ${className}`}
    >
      <div className="flex flex-col justify-between md:w-full md:flex-row xl:w-1/2">
        <FooterBrand />

        <div className="mt-10 flex flex-col space-y-4 md:mt-0 md:flex-row md:justify-end md:space-x-6 md:space-y-0">
          <FooterSection
            section={{
              title: 'Resources',
              links: resourcesLinks,
            }}
          />
        </div>
      </div>
    </footer>
  );
}
