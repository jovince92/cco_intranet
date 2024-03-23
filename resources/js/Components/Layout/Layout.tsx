import {FC, ReactNode} from 'react';
import Navbar from '../Navbar';
import ModalProvider from '@/Providers/ModalProvider';

interface Props {
    children:ReactNode;
}

const Layout:FC<Props> = ({children}) => {
    return (
        <>
            <ModalProvider />
            <div className='h-full flex flex-col  '>
                <Navbar />
                <div className='flex-1 overflow-y-hidden'>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Layout;