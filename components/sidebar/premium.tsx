import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Sparkles } from 'lucide-react'
import { ShineBorder } from '../magicui/shine-border'

const PremiumCard = () => {
    return (
        <Card className="relative overflow-hidden bg-neutral-900 rounded-xl text-white border-none py-4 mx-2">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className='absolute inset-0' />
            <CardHeader className='px-4'>
                <CardTitle className='flex items-center gap-2'>
                    <Sparkles className="w-4 h-4" color='white' />
                    Premium
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