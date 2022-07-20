import React from 'react'

interface Props {
    headers: Array<string>,
    content: Array<any>,
}

function Table ({ headers, content }: Props) {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header, key) => (
                        <th key={key}>{ header }</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {content.map((item, itemKey) => (
                    <tr key={itemKey}>
                        {Object.keys(item).map((key, keyKey) => (
                            <td key={keyKey}>{item[key]}</td>
                        ))}
                    </tr>
                )
                )}
            </tbody>
        </table>
    )
}

export default Table
