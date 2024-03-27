import { FC } from "react"

interface Props{
    title?:string;
    hidePicture?:boolean;
}

const Header:FC<Props> = ({title="CCO Latest Announcements",hidePicture}) => {
    return (
        <div className='container mx-auto  h-auto space-y-3.5 p-3.5 flex items-center justify-center'>
            <h1 className='text-base md:text-2xl font-semibold flex items-center gap-x-2'>
                {!hidePicture&&<img className='h-12 w-12 dark:invert' src={`${route('public_route')}/logo/board.svg`} alt="Board" />}
            <span>{title}</span>
            </h1>
        </div>
    )
}
export default Header