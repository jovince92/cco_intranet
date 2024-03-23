import {FC} from 'react';
import { NavLink } from '@/Pages/Welcome';
import { Button } from './ui/button';
import { CircleUserRound,  MenuIcon } from 'lucide-react';
import MenuSheet from './MenuSheet';
import { useAuthModal } from '@/Hooks/useAuthModal';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia, Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import UserButton from './NavbarComponents/UserButton';

interface Props {
}

const Navbar:FC<Props> = ({}) => {
    const {onOpen} = useAuthModal();
    
    const {user} = usePage<Page<PageProps>>().props.auth;
    return (
        <nav className='z-50 py-2.5 backdrop-blur-lg border-b border-b-muted-foreground/80 px-3.5 h-auto'>
            <div className='container px-3.5 mx-auto relative text-sm flex items-center justify-between'>
                <div className='flex justify-center items-center gap-x-2'>
                    <MenuSheet>
                        <Button variant='ghost' className='rounded-full' size='icon'>
                            <MenuIcon />
                        </Button>
                    </MenuSheet>
                    <Link href={route('welcome')}>
                        <div className='flex items-center flex-shrink-0'>
                            <img className='h-10 w-16 mr-2' src={`${route('public_route')}/logo/fpo.png`} alt="FPO" />
                            <span className='text-xl tracking-tight font-semibold'>CCO Intranet</span>
                        </div>
                    </Link>
                </div>
                {
                    !user?(
                        <Button onClick={onOpen} variant='outline' size='sm'>
                            <CircleUserRound className='h-4 w-4 mr-2' />
                            <span>Sign In</span>
                        </Button>
                    ):<UserButton />
                }
                
            </div>
        </nav>
    );
};

export default Navbar;