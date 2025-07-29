import Image from "next/image"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border/10 bg-black flex items-center justify-center">
            <div className="container mx-auto px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center space-x-3 mb-6">
                        <Image src="/open-cal.svg" alt="Logo" width={50} height={50} />
                    </div>
                    <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                        An Open Source AI alternative to Google Calendar.
                    </p>
                </div>
                <div className="border-t border-border pt-5 text-center">
                    <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Digit. All rights reserved. <Link href="/github" className="underline">Github</Link></p>
                </div>
            </div>
        </footer>
    )
}