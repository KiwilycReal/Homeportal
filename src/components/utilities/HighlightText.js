
const HightlightText = (props) => {
    const {
        backgroundColor = '#fff759',
        textColor = 'inherit',
        rawText,
        keyword
    } = props;

    const HighlightPart = () => <span style={{
        color: textColor,
        backgroundColor: backgroundColor
    }}>
        {keyword}
    </span>

    const generateHighlightText = () => {
        // Skip spliting if the keyword is ''
        if(keyword === '') return rawText;

        let plainParts = rawText.split(new RegExp(keyword, 'gi'));
        // Return the raw text if no match found
        if(plainParts.length === 1) return rawText;
        
        return plainParts.map((part, index) => <span key={index}>
            <span>{part}</span>
            {index < plainParts.length-1 && <HighlightPart />}
        </span>);
    }

    return <>{generateHighlightText()}</>
};

export default HightlightText;