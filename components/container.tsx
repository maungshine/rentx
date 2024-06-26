


function Container({ children, classnames = '' }: { children: React.ReactNode, classnames?: string }) {
    return (
        <div className={`max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-2${classnames}`}>
            {children}
        </div>
    )
}

export default Container