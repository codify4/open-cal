'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Sparkles, X } from 'lucide-react'
import { ShineBorder } from '../magicui/shine-border'
import { useState } from 'react'

const PremiumCard = () => {
    const [close, setClose] = useState(false)

    return (
        <Card className={`relative overflow-hidden bg-neutral-900 rounded-xl text-white border-none py-4 mx-2 ${close ? 'hidden' : ''}`}>
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className='absolute inset-0' />
            <CardHeader className='px-4'>
                <CardTitle className='flex items-center justify-between gap-2'>
                    <div className='flex flex-row items-center gap-2'>
                        <Sparkles className="w-4 h-4" color='white' />
                        <p className='text-sm font-medium'>Premium</p>
                    </div>

                    <Button variant='ghost' size='icon' className='absolute right-2 top-2' onClick={() => setClose(true)}>
                        <X className='w-4 h-4' color='white' />
                    </Button>
                </CardTitle>
                <CardDescription>
                    Upgrade to the premium plan to get access to all features.
                </CardDescription>
            </CardHeader>
            <CardContent className='px-4'>
                <Button className="w-full bg-white hover:bg-white/80 text-black">
                    Upgrade
                </Button>
            </CardContent>
        </Card>
    )
}

export default PremiumCard