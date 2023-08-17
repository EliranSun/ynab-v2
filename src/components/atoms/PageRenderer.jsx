const PageRenderer = ({ element, currentPageName, pageName }) => {
    if (currentPageName !== pageName) {
        return null;
    }
    
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow">
                {element}
            </div>
        </div>
    )
}

export default PageRenderer;
