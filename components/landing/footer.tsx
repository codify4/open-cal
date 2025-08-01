import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { XIcon } from '@/lib/lucide/custom-icons';

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
                <Image alt="Logo" height={50} src="/logo-oc.svg" width={120} />
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
                The open source AI calendar that gets the job done. Simple, powerful, and works on any platform.
            </p>
            <div className="flex items-center space-x-4">
                <Link href="/github" className="text-muted-foreground hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                </Link>
                <Link href="/x" className="text-muted-foreground hover:text-white transition-colors">
                    <XIcon className="h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
    return (
        <div className="flex flex-col space-y-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    className="text-muted-foreground hover:text-white transition-colors text-sm"
                    href={link.href}
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
                <h3 className="text-white font-semibold text-sm">{section.title}</h3>
            )}
            <FooterLinks links={section.links} />
        </div>
    );
}

function FooterCopyright() {
    return (
        <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} OpenCal, All Rights Reserved.
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
        <footer className={`flex items-center justify-center p-10 border-border border-t bg-black ${className}`}>
            <div className="flex flex-row justify-between w-1/2">
                <FooterBrand />
                
                <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-6">
                    <FooterSection 
                        section={{ 
                            title: 'Resources', 
                            links: resourcesLinks 
                        }} 
                    />
                </div>
            </div>
        </footer>
    );
}
