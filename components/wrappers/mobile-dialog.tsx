import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const MobileDialog = () => {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (isMobile) {
            setOpen(true);
        }
    }, [isMobile]);

    if (!isMobile) {
        return null;
    }

    return (
        <>
            <Dialog open={open} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-md bg-neutral-950 rounded-lg" showCloseButton={false}>
                    <DialogHeader className='flex flex-col items-center'>
                        <DialogTitle className='flex flex-col items-center'>
                            <Image alt="OpenCal" height={40} src="/logo-name.svg" width={140} className='rounded-full' />
                            <p className='text-center text-base text-white'>
                                We are building the best mobile experience for ai calendars.
                            </p>
                        </DialogTitle>
                    </DialogHeader>

                    <div className='text-center text-sm text-muted-foreground'>
                        The mobile version will be available soon. For now, you can use the desktop version for the best experience.
                    </div>
                    <DialogFooter>
                        <Link href="/">
                            <Button className='w-full'>
                                Go back
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MobileDialog;