'use client';

import { User } from 'lucide-react';
import { UserProfile } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function ClerkUserDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="rounded-sm"
                >
                    <User className="h-4 w-4" />
                    View More
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit rounded-2xl p-0">
                <DialogTitle className="sr-only">User Profile</DialogTitle>
                <UserProfile 
                    routing='hash'
                />
            </DialogContent>
        </Dialog>
    );
}
