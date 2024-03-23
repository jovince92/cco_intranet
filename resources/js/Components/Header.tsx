const Header = () => {
    return (
        <div className='container mx-auto  h-auto space-y-3.5 p-3.5 flex items-center justify-center'>
            <h1 className='text-base md:text-2xl font-semibold flex items-center gap-x-2'>
                <img className='h-12 w-12 dark:invert' src={`${route('public_route')}/logo/board.svg`} alt="Board" />
            <span>CCO Latest     Announcements</span>
            </h1>
        </div>
    )
}
export default Header