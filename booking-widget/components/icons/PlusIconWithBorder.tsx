import React from 'react'

interface Props {
    className? : string;
}

const PlusIconWithBorder = ({className}: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className={className}>
            <circle cx="20" cy="20" r="19.5" fill="white" stroke="#E6E6E6" />
            <g clipPath="url(#clip0_290_5179)">
                <path d="M19 19V13H21V19H27V21H21V27H19V21H13V19H19Z" fill="#0d1b2e" />
            </g>
            <defs>
                <clipPath id="clip0_290_5179">
                    <rect width="24" height="24" fill="white" transform="translate(8 8)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default PlusIconWithBorder