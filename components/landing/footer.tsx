import { XIcon } from '@/lib/lucide/custom-icons';
import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex items-center justify-center border-border/10 border-t bg-black">
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex items-center space-x-3">
            <Image alt="Logo" height={50} src="/logo-oc.svg" width={120} />
          </div>
          <p className="mb-3 max-w-md text-muted-foreground leading-relaxed">
            An Open Source AI alternative to Google Calendar.
          </p>
        </div>
        <div className="flex flex-col items-center border-border border-t pt-2 text-center">
            © {new Date().getFullYear()} Digit. All rights reserved.
          <p className="flex flex-row gap-5 text-muted-foreground text-sm">
            <Link className="flex items-center gap-2 py-2" href="/github">
              <Github className="h-4 w-4" fill="white" />
              <span className="text-white hover:underline">GitHub</span>
            </Link>
            <Link className="flex items-center gap-2 py-2" href="/x">
              <XIcon key="x" className="text-white h-4 w-4" />
              <span className="text-white hover:underline">X(Twitter)</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
