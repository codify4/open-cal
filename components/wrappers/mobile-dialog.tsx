import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
      <Dialog onOpenChange={() => {}} open={open}>
        <DialogContent
          className="rounded-lg bg-neutral-950 sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="flex flex-col items-center">
              <Image
                alt="OpenCal"
                className="rounded-full"
                height={40}
                src="/logo-name.svg"
                width={140}
              />
              <p className="text-center text-base text-white">
                We are building the best mobile experience for ai calendars.
              </p>
            </DialogTitle>
          </DialogHeader>

          <div className="text-center text-muted-foreground text-sm">
            The mobile version will be available soon. For now, you can use the
            desktop version for the best experience.
          </div>
          <DialogFooter>
            <Link href="/">
              <Button className="w-full">Go back</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileDialog;
